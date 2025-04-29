import type { GatsbyNode } from 'gatsby';
import puppeteer from 'puppeteer-core';
import path from 'path';
import { configDotenv } from 'dotenv';
import chromium from 'chromium';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';

configDotenv({ path: `.env.${process.env.NODE_ENV}` });

// node source from CSL
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
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

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({ actions: { createNode }, createContentDigest }) => {
  const clientId = process.env.CSL_CLIENT_ID;
  const clientSecret = process.env.CSL_CLIENT_SECRET;
  const cslPath = process.env.CSL_PATH;

  const allEvents = await getAllGoodEvents();

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

  // console.log('New token: ', accessToken);

  const fetchEventDetails = async (slug: string) => {
    const res = await fetch(`${cslPath}/api/v1/events/${slug}?access_token=${accessToken}`, {
      method: 'GET',
      headers: jsonHeaders,
    });
    const { event } = await res.json();
    return event;
  };

  const fetchAllAttendees = async (eventSlug: string) => {
    let attendees: any[] = [];
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

  const createEventNode = async (event: any, originalSlug: string) => {
    const shouldCreate = shouldCreateEvent(event);
    if (!shouldCreate) return console.log(`Event ${originalSlug} not created.`);

    console.log('[CSL Source] Creating:', event.title);
    const cslInputs = await scrapingFormInputs(event);

    let isWaitingListEnabled = false;
    if (event.max_attendees_count) {
      const attending = await fetchAllAttendees(originalSlug);
      if (attending.length >= event.max_attendees_count) {
        console.log(`Event ${originalSlug} has waiting list enabled.`);
        isWaitingListEnabled = true;
      }
    }

    createNode({
      ...event,
      id: String(event.id || originalSlug),
      slug: originalSlug,
      title: event.title,
      calendar: event.calendar,
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
      internal: {
        type: 'ExternalEvent',
        contentDigest: createContentDigest(event),
      },
    });
  };

  for (const event of allEvents) {
    const fullEvent = await fetchEventDetails(event.slug);
    await createEventNode(fullEvent, event.slug);
  }

  const extraSlugs = ['test-event-whatsapp-link', 'test-event-zoom'];
  for (const slug of extraSlugs) {
    const fullEvent = await fetchEventDetails(slug);
    await createEventNode(fullEvent, slug);
  }
};

export const createPages: GatsbyNode['createPages'] = ({ graphql, actions }) => {
  const { createPage, createSlice, createRedirect } = actions;

  createSlice({ id: `header`, component: path.resolve(`./src/components/Layout/Header.js`) });
  createSlice({ id: `footer`, component: path.resolve(`./src/components/Layout/Footer/Footer.js`) });

  return new Promise((resolve, reject) => {
    const templates = {
      home: path.resolve('./src/templates/home.js'),
      page: path.resolve('./src/templates/page.js'),
      event: path.resolve('./src/templates/event.js'),
      listEvents: path.resolve('./src/templates/listEvents.js'),
      group: path.resolve('./src/templates/group.js'),
      listGroups: path.resolve('./src/templates/listGroups.js'),
      tool: path.resolve('./src/templates/tool.js'),
      listTools: path.resolve('./src/templates/listTools.js'),
      cslEvent: path.resolve('./src/templates/cslEvent.js'),
      listWhatsAppGroups: path.resolve('./src/templates/listWhatsappGroups.js'),
      pageWhatsAppGroups: path.resolve('./src/templates/pageWhatsappCom.js'),
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
          },
        });

        // Debug output - check what's coming from the API
        // console.log('Redirects data:', JSON.stringify(result.data?.redirects, null, 2));

        const redirects = result.data?.redirects.edges;
        redirects.forEach(({ node }) => {
          if (typeof node.sourcePath === 'string' && typeof node.destinationPath === 'string') {
            createRedirect({
              fromPath: node.sourcePath,
              toPath: node.destinationPath,
              statusCode: parseInt(node.statusCode || '301'),
              isPermanent: (node.statusCode || '301') === '301',
            });
            console.log(`Created redirect: ${node.sourcePath} → ${node.destinationPath}`);
          } else {
            console.warn(`Skipping invalid redirect: ${JSON.stringify(node)}`);
          }
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
            },
          });
        }

        // Group detail
        const RADIUS_KM = 15;
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
      })
    );
  });
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ stage, actions, getConfig }) => {
  actions.setWebpackConfig({
    plugins: [
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
      }),
    ],
  });
};

// Utils
const shouldCreateEvent = (event: any) => Array.isArray(event.labels) && !event.labels.includes('hidden');

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const scrapingFormInputs = async (event: any) => {
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

// CSL Utils
const getAllGoodEvents = async () => {
  const cslPath = process.env.CSL_PATH;
  const events = [];

  let currentPage = 1;
  let totalPages = 1;

  do {
    const result = await fetch(`${cslPath}/api/local.json?page=${currentPage}`, {
      method: 'GET',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    const resultData = await result.json();

    if (!resultData || !resultData.meta) {
      throw new Error('Invalid response structure');
    }

    const futureEvents = resultData.data;
    events.push(...futureEvents);

    const meta = resultData.meta;
    totalPages = meta.total_pages;
    currentPage += 1;
  } while (currentPage <= totalPages);

  return events;
};
