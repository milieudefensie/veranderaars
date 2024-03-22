const path = require(`path`);
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

// node source from CSL
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
      'Content-Type': 'application/x-www-form-urlencoded'
      },
  });

  const recievedToken = await accessToken.json();

  const result = await fetch(`${cslPath}/api/v1/events?access_token=${recievedToken.access_token}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });

  const resultData = await result.json();
  for (const event of resultData.events) {
    createNode({
      ...event,
      id: event.slug,
      title: event.title,
      internal: {
        type: 'ExternalEvent',
        contentDigest: createContentDigest(event),
      },
    });
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createNode } = actions;

  return new Promise((resolve, reject) => {
    const templates = {
      page: path.resolve('./src/templates/page.js'),
      event: path.resolve('./src/templates/event.js'),
      listEvents: path.resolve('./src/templates/listEvents.js'),
      group: path.resolve('./src/templates/group.js'),
      listGroups: path.resolve('./src/templates/listGroups.js'),
      tool: path.resolve('./src/templates/tool.js'),
      listTools: path.resolve('./src/templates/listTools.js'),
    };

    resolve(
      graphql(`
        {
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
