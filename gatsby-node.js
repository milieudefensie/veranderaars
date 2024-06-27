const { DateTime } = require('luxon');
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
      start_at: Date
      raw_start: String
      raw_end: String
      end_at: String
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
      internal: Internal
      location: Location
      calendar: Calendar      
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
};

exports.sourceNodes = async ({ actions: { createNode }, createContentDigest }) => {
  const clientId = process.env.CSL_CLIENT_ID;
  const clientSecret = process.env.CSL_CLIENT_SECRET;
  const cslPath = process.env.CSL_PATH;

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  const accessToken = await fetch(`${cslPath}/oauth/token?grant_type=client_credentials`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const receivedToken = await accessToken.json();

  // Fetch all CSL events + create nodes
  let currentPage = 1;
  let totalPages = 1;

  do {
    const result = await fetch(
      `${cslPath}/api/v1/events?access_token=${receivedToken.access_token}&page=${currentPage}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const resultData = await result.json();

    const today = DateTime.now().setZone('Europe/Amsterdam');
    const futureEvents = resultData.events.filter((e) => {
      const startDate = DateTime.fromISO(e.start_at, { zone: 'Europe/Amsterdam' });
      return startDate > today && e.launched_at !== null;
    });

    for (const event of futureEvents) {
      console.log('[CSL Source] Creating: ', event.title);

      createNode({
        ...event,
        id: event.slug,
        title: event.title,
        labels: event.labels || [],
        start_at: event.start_at ? new Date(event.start_at).toISOString().split('T')[0] : null,
        raw_start: event.start_at,
        raw_end: event.end_at,
        start_in_zone: event.start_in_zone,
        end_in_zone: event.end_in_zone,
        time_zone: event.time_zone,
        internal: {
          type: 'ExternalEvent',
          contentDigest: createContentDigest(event),
        },
      });
    }

    const meta = resultData.meta;
    totalPages = meta.total_pages;
    currentPage = meta.next_page;
  } while (currentPage);
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createSlice } = actions;

  createSlice({ id: `header`, component: require.resolve(`./src/components/Layout/Header.js`) });
  createSlice({ id: `footer`, component: require.resolve(`./src/components/Layout/Footer/Footer.js`) });

  return new Promise((resolve, reject) => {
    const templates = {
      page: path.resolve('./src/templates/page.js'),
      event: path.resolve('./src/templates/event.js'),
      listEvents: path.resolve('./src/templates/listEvents.js'),
      group: path.resolve('./src/templates/group.js'),
      listGroups: path.resolve('./src/templates/listGroups.js'),
      tool: path.resolve('./src/templates/tool.js'),
      listTools: path.resolve('./src/templates/listTools.js'),
      cslEvent: path.resolve('./src/templates/cslEvent.js'),
    };

    resolve(
      graphql(`
        {
          configuration: datoCmsSiteConfiguration {
            cslGenericImage {
              url
              alt
            }
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
        }
      `).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // create the pages
        const pages = result.data.pages.edges;
        for (const page of pages) {
          createPage({
            path: page.node.slug,
            component: templates.page,
            context: {
              slug: page.node.slug,
              id: page.node.id,
            },
          });
        }

        // list events
        const listEvents = result.data.listEvents || [];
        if (listEvents) {
          createPage({
            path: listEvents.slug,
            component: templates.listEvents,
            context: {
              slug: listEvents.slug,
              currentDate: new Date().toISOString().split('T')[0],
            },
          });
        }

        const events = result.data.events.edges;
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

        const CSLEvents = result.data.CSLevents.nodes;
        for (const event of CSLEvents) {
          createPage({
            path: `/lokaal/${event.slug}`,
            component: templates.cslEvent,
            context: {
              slug: event.slug,
              id: event.id,
              heroImage: result.data.configuration.cslGenericImage,
            },
          });
        }

        // list groups
        const listGroups = result.data.listGroups || [];
        if (listGroups) {
          createPage({
            path: listGroups.slug,
            component: templates.listGroups,
            context: {
              slug: listGroups.slug,
            },
          });
        }

        const groups = result.data.groups.edges;
        for (const group of groups) {
          createPage({
            path: `/groep/${group.node.slug}`,
            component: templates.group,
            context: {
              slug: group.node.slug,
              id: group.node.id,
              currentDate: new Date().toISOString().split('T')[0],

              // latitude
              latitude: group.node.coordinates?.latitude,
              maxLat: group.node.coordinates?.latitude ? group.node.coordinates.latitude + 1 : null,
              minLat: group.node.coordinates?.latitude ? group.node.coordinates.latitude - 1 : null,

              // longitude
              longitude: group.node.coordinates?.longitude,
              maxLon: group.node.coordinates?.longitude ? group.node.coordinates.longitude + 1 : null,
              minLon: group.node.coordinates?.longitude ? group.node.coordinates.longitude - 1 : null,
            },
          });
        }

        // list tools
        const listTools = result.data.listTools || [];
        if (listTools) {
          createPage({
            path: listTools.slug,
            component: templates.listTools,
            context: {
              slug: listTools.slug,
            },
          });
        }

        const tools = result.data.tools.edges;
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
