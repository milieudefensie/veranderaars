require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
  siteMetadata: {
    title: `Milieudefensie`,
    siteUrl: `https://veranderaars.milieudefensie.nl`,
  },
  plugins: [
    {
      resolve: 'gatsby-source-datocms',
      options: {
        apiToken: process.env.DATO_API_TOKEN,
        previewMode: process.env.NODE_ENV !== 'production',
        environment: process.env.DATO_ENVIRONMENT ? process.env.DATO_ENVIRONMENT : '',
        disableLiveReload: false,
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-MMB2NFFR',
        enableWebVitalsTracking: true,
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sass',
    'gatsby-plugin-advanced-sitemap',
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-schema-snapshot`,
      // options: {
      //   path: `schema.gql`,
      //   exclude: {
      //     plugins: [`gatsby-source-npm-package-search`],
      //   },
      // },
    },
  ],
  flags: {
    // FAST_DEV: true,
    PARALLEL_SOURCING: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true, // Este es opcional, si tienes cache habilitada
  },
};
