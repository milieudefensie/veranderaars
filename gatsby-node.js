const puppeteer = require('puppeteer');
const chromium = require('chromium');
const path = require(`path`);
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

// node source from CSL
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const externalEvent = `
    type ExternalEvent implements Node {
      id: ID!
      slug: String!
      title: String!
      url: String
      description: String
      rich_description: String
      start_at: Date
      start_tz: String
      raw_start: String
      raw_end: String
      end_at: String
      end_tz: String
      cancelled_at: String
      start_in_zone: String
      end_in_zone: String
      time_zone: String
      virtual: Boolean
      launched_at: String
      locale: String
      host_address: String
      max_attendees_count: String
      image_url: String
      labels: [String!]!
      inputs: [String!]!
      internal: Internal
      location: Location
      calendar: Calendar
      hiddenAddress: Boolean     
      web_conference_url: String 
      waiting_list_enabled: Boolean
      additional_image_sizes_url: [ImageCSLType]
      cms_status: String
      show_in_agenda_list: Boolean
    }
    type ImageCSLType {
      url: String
      style: String
    }
    type Calendar {
      name: String
      title: String
      slug: String
      url: String
    }
    type Location {
      latitude: Float
      longitude: Float
      postal_code: String
      country: String
      region: String
      locality: String
      query: String
      street: String
      street_number: String
      venue: String
      created_at: String
    }
    type Internal {
      type: String!
      contentDigest: String!
    }
  `;
  createTypes(externalEvent);

  const typeDefs = `
    type DatoCmsRedirect implements Node {
      sourcePath: String!
      destinationPath: String!
      statusCode: String!
      active: Boolean!
    }
  `;
  createTypes(typeDefs);
};

exports.sourceNodes = async ({ actions: { createNode }, createContentDigest }) => {
  const clientId = process.env.CSL_CLIENT_ID;
  const clientSecret = process.env.CSL_CLIENT_SECRET;
  const cslPath = process.env.CSL_PATH;

  const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenResponse = await fetch(`${cslPath}/oauth/token?grant_type=client_credentials`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token: accessToken } = await tokenResponse.json();
  const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

  // console.log('New token:', accessToken);

  const allEvents = await getAllEvents(accessToken);
  const allPublicEvents = await getAllPublicEvents();

  const fetchAllAttendees = async (eventSlug) => {
    let attendees = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `${cslPath}/api/v1/events/${eventSlug}/attendees?access_token=${accessToken}&page=${currentPage}`,
        { method: 'GET', headers: jsonHeaders }
      );
      const data = await res.json();
      attendees = attendees.concat(data.attendees);
      currentPage = data.meta.next_page;
      hasMore = !!currentPage;
    }

    return attendees.filter((a) => a.attending_status === 'attending');
  };

  const createEventNode = async (event) => {
    const now = new Date();
    const isCancelled = Boolean(event.cancelled_at);

    const start = event.start_at ? new Date(event.start_at) : null;
    const end = event.end_at ? new Date(event.end_at) : null;
    const hasEnded = end ? end < now : start ? start < now : true;
    const isActive = !isCancelled && !hasEnded;

    const cmsStatus = isActive ? 'active' : 'disable';

    const shouldCreate = shouldCreateEvent(event);
    if (!shouldCreate) {
      return console.log(`Event ${event.slug} ignored by shouldCreateEvent.`);
    }

    if (isCancelled) {
      return console.log(`Event ${event.slug} skipped (cancelled).`);
    }

    console.log(`[CSL Source] Creating: ${event.title} (${cmsStatus})`);

    let cslInputs = [];
    let isWaitingListEnabled = false;

    if (isActive) {
      cslInputs = await scrapingFormInputs(event);

      if (event.max_attendees_count) {
        const attending = await fetchAllAttendees(event.slug);
        if (attending.length >= event.max_attendees_count) {
          console.log(`Event ${event.slug} has waiting list enabled.`);
          isWaitingListEnabled = true;
        }
      }
    }

    createNode({
      ...event,
      id: String(event.id || event.slug),
      slug: event.slug,
      title: event.title,
      labels: event.labels || [],
      start_at: event.start_at ? new Date(event.start_at).toISOString().split('T')[0] : null,
      raw_start: event.start_at,
      raw_end: event.end_at,
      start_in_zone: event.start_in_zone,
      end_in_zone: event.end_in_zone,
      time_zone: event.time_zone,
      inputs: cslInputs || [],
      hiddenAddress: event.hiddenAddress || event.hidden_address,
      web_conference_url: event.web_conference_url,
      max_attendees_count: event.max_attendees_count,
      waiting_list_enabled: isWaitingListEnabled,
      rich_description: event.rich_description,
      cms_status: cmsStatus,
      show_in_agenda_list: Boolean(allPublicEvents.find((pe) => pe.slug === event.slug)),
      internal: {
        type: 'ExternalEvent',
        contentDigest: createContentDigest(event),
      },
    });
  };

  for (const event of allEvents) {
    await createEventNode(event);
  }

  console.log(`[CSL Source] Finished creating ${allEvents.length} events.`);
};

const getAllEvents = async (accessToken) => {
  const baseUrl = `https://klimaatmars.milieudefensie.nl/api/v1/events/?access_token=${accessToken}`;
  const events = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    console.log(`Fetching page ${currentPage} of events...`);
    const response = await fetch(`${baseUrl}&page=${currentPage}`);
    const data = await response.json();

    if (!data || !data.meta) {
      throw new Error('Invalid response structure');
    }

    events.push(...data.events);

    totalPages = data.meta.total_pages || 1;
    currentPage = data.meta.next_page;
  } while (currentPage);

  console.log(`[CSL Source] Total events fetched: ${events.length}`);
  return events;
};

const getAllPublicEvents = async () => {
  const baseUrl = `https://klimaatmars.milieudefensie.nl/api/local.json`;
  const events = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    console.log(`[PUBLIC EVENTS] Fetching page ${currentPage} of events...`);
    const response = await fetch(`${baseUrl}?page=${currentPage}`);
    const data = await response.json();

    if (!data || !data.meta) {
      throw new Error('Invalid response structure');
    }

    events.push(...data.data);

    totalPages = data.meta.total_pages ?? 1;
    currentPage++;
  } while (currentPage <= totalPages);

  console.log(`[PUBLIC CSL Source] Total events fetched: ${events.length}`);
  return events;
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createSlice, createRedirect } = actions;

  createSlice({ id: `header`, component: require.resolve(`./src/components/Layout/header.tsx`) });
  createSlice({ id: `footer`, component: require.resolve(`./src/components/Layout/Footer/footer.tsx`) });

  return new Promise((resolve, reject) => {
    const templates = {
      home: path.resolve('./src/templates/home.tsx'),
      page: path.resolve('./src/templates/page.tsx'),
      event: path.resolve('./src/templates/event.tsx'),
      listEvents: path.resolve('./src/templates/listEvents.tsx'),
      group: path.resolve('./src/templates/group.tsx'),
      listGroups: path.resolve('./src/templates/list-groups.tsx'),
      tool: path.resolve('./src/templates/tool.tsx'),
      listTools: path.resolve('./src/templates/list-tools.tsx'),
      cslEvent: path.resolve('./src/templates/csl-event.tsx'),
      listWhatsAppGroups: path.resolve('./src/templates/list-whatsapp-groups.tsx'),
      pageWhatsAppGroups: path.resolve('./src/templates/page-whatsapp-com.tsx'),
      listSignalGroups: path.resolve('./src/templates/list-signal-groups.tsx'),
    };

    resolve(
      graphql(`
        {
          configuration: datoCmsSiteConfiguration {
            cslGenericImage {
              url
              alt
            }
            slugOfHighlightedEvent
            slugOfHighlightedEventAgenda
            eventsHidden
          }
          pages: allDatoCmsBasicPage {
            edges {
              node {
                id
                slug
                title
              }
            }
          }

          listEvents: datoCmsListEvent {
            id
            slug
            title
          }

          events: allDatoCmsEvent {
            edges {
              node {
                id
                slug
                title
                externalLink
                introduction
                date
                hourStart
                hourEnd
                onlineEvent
                tags {
                  ... on DatoCmsTag {
                    id
                    title
                  }
                }
                image {
                  gatsbyImageData(width: 900, height: 505)
                }
                model {
                  apiKey
                }
              }
            }
          }

          CSLevents: allExternalEvent {
            nodes {
              id
              slug
              title
            }
          }

          listGroups: datoCmsListGroup {
            id
            slug
            title
          }

          groups: allDatoCmsGroup {
            edges {
              node {
                id
                slug
                title
                coordinates {
                  latitude
                  longitude
                }
              }
            }
          }

          listTools: datoCmsListTool {
            id
            slug
            title
          }

          tools: allDatoCmsTool {
            edges {
              node {
                id
                slug
                title
              }
            }
          }
          listWhatsAppGroups: datoCmsListGroupWhatsappCommunity {
            id
            slug
            title
          }
          listSignalGroups: datoCmsListSignalGroup {
            id
            slug
            title
          }

          redirects: allDatoCmsRedirect(filter: { active: { eq: true } }) {
            edges {
              node {
                sourcePath
                destinationPath
                statusCode
              }
            }
          }
        }
      `).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const cslHighlightedEvent = result.data?.configuration.slugOfHighlightedEvent;
        const cslHighlightedEventAgenda = result.data?.configuration.slugOfHighlightedEventAgenda;
        const cslSlugsOfEventsHidden = result.data?.configuration.eventsHidden;

        // Create homepage
        createPage({
          path: '/',
          component: templates.home,
          context: {
            cslHighlightedEvent: cslHighlightedEvent,
            latestEvent: result.data.events.edges
              .filter((e) => new Date(e.node.date).getTime() >= Date.now())
              .slice(0, 2)
              .map((e) => e.node),
          },
        });

        // create the pages
        const pages = result.data?.pages.edges;
        for (const page of pages) {
          createPage({
            path: page.node.slug,
            component: page.node.slug === 'whatsapp' ? templates.pageWhatsAppGroups : templates.page,
            context: {
              slug: page.node.slug,
              id: page.node.id,
            },
          });
        }

        // list events
        const listEvents = result.data?.listEvents || [];
        if (listEvents) {
          createPage({
            path: listEvents.slug,
            component: templates.listEvents,
            context: {
              slug: listEvents.slug,
              cslHighlightedEvent: cslHighlightedEventAgenda,
              currentDate: new Date().toISOString().split('T')[0],
              cslEventsHidden: cslSlugsOfEventsHidden,
            },
          });
        }

        const events = result.data?.events.edges;
        for (const event of events) {
          createPage({
            path: `/agenda/${event.node.slug}`,
            component: templates.event,
            context: {
              slug: event.node.slug,
              id: event.node.id,
            },
          });
        }

        const CSLEvents = result.data?.CSLevents.nodes;
        for (const event of CSLEvents) {
          createPage({
            path: `/lokaal/${event.slug}`,
            component: templates.cslEvent,
            context: {
              slug: event.slug,
              id: event.id,
              heroImage: result.data?.configuration.cslGenericImage,
            },
          });
        }

        // list groups
        const listGroups = result.data?.listGroups || [];
        if (listGroups) {
          createPage({
            path: listGroups.slug,
            component: templates.listGroups,
            context: {
              slug: listGroups.slug,
              currentDate: new Date().toISOString().split('T')[0],
              cslEventsHidden: cslSlugsOfEventsHidden,
            },
          });
        }

        // Group detail
        const RADIUS_KM = 10;
        const KM_PER_DEGREE_LAT = 111;
        const KM_PER_DEGREE_LNG = 111;

        const groups = result.data?.groups.edges;

        for (const group of groups) {
          const latitude = group.node.coordinates?.latitude;
          const longitude = group.node.coordinates?.longitude;

          const latRange = RADIUS_KM / KM_PER_DEGREE_LAT;
          const lngRange = RADIUS_KM / (KM_PER_DEGREE_LNG * Math.cos((latitude * Math.PI) / 180));

          createPage({
            path: `/groep/${group.node.slug}`,
            component: templates.group,
            context: {
              slug: group.node.slug,
              id: group.node.id,
              currentDate: new Date().toISOString().split('T')[0],
              minDate2024: '2024-01-01T00:00:00Z',

              // latitude
              latitude: latitude,
              maxLat: latitude ? latitude + latRange : null,
              minLat: latitude ? latitude - latRange : null,
              // longitude
              longitude: longitude,
              maxLon: longitude ? longitude + lngRange : null,
              minLon: longitude ? longitude - lngRange : null,
            },
          });
        }

        // list tools
        const listTools = result.data?.listTools || [];
        if (listTools) {
          createPage({
            path: listTools.slug,
            component: templates.listTools,
            context: {
              slug: listTools.slug,
            },
          });
        }

        const tools = result.data?.tools.edges;
        for (const tool of tools) {
          createPage({
            path: `/toolkit/${tool.node.slug}`,
            component: templates.tool,
            context: {
              slug: tool.node.slug,
              id: tool.node.id,
            },
          });
        }

        // list WhatsApp Groups
        const listWhatsAppGroups = result.data?.listWhatsAppGroups || [];
        if (listWhatsAppGroups) {
          createPage({
            path: listWhatsAppGroups.slug,
            component: templates.listWhatsAppGroups,
            context: {
              slug: listWhatsAppGroups.slug,
            },
          });
        }

        // list Signal Groups
        const listSignalGroups = result.data?.listSignalGroups || [];
        if (listSignalGroups) {
          createPage({
            path: listSignalGroups.slug,
            component: templates.listSignalGroups,
            context: {
              slug: listSignalGroups.slug,
            },
          });
        }

        const redirects = result.data.redirects.edges;
        redirects.forEach(({ node }) => {
          if (typeof node.sourcePath === 'string' && typeof node.destinationPath === 'string') {
            createRedirect({
              fromPath: node.sourcePath,
              toPath: node.destinationPath,
              statusCode: parseInt(node.statusCode || '301'),
              isPermanent: (node.statusCode || '301') === '301',
            });
          } else {
            console.warn(`Skipping invalid redirect: ${JSON.stringify(node)}`);
          }
        });
      })
    );
  });
};

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    plugins: [
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
      }),
    ],
  });
};

// Utils
const shouldCreateEvent = (event) => Array.isArray(event.labels) && !event.labels.includes('hidden');

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const scrapingFormInputs = async (event) => {
  const url = `https://lokaal.milieudefensie.nl/events/${event.slug}`;
  console.log('Start web scraping. URL: ', url);

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: chromium.path,
      timeout: 50_000,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.attend-event-form input')).map((input) => input.outerHTML);
    });
    await browser.close();

    return inputs;
  } catch (error) {
    console.error('Error on scraping:', error);
    throw error;
  }
};
