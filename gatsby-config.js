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
    // `gatsby-plugin-netlify`,
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {}, // Define headers here if needed
        // Define your redirects here
        redirects: [
          {
            fromPath: 'https://www.datocms-assets.com/115430/1739453560-algemene-ava-handleiding-md-2025.pdf',
            toPath: 'https://www.datocms-assets.com/115430/1740411395-algemene-ava-handleiding-md-2025.pdf',
            isPermanent: true, // Creates a 301 redirect (permanent)
            force: true, // Ensures the redirect happens even if the fromPath exists
          },
          {
            fromPath: 'https://www.datocms-assets.com/115430/1740481214-algemene-ava-handleiding-md-2025.pdf',
            toPath: 'https://www.datocms-assets.com/115430/1740411395-algemene-ava-handleiding-md-2025.pdf',
            isPermanent: true, // Creates a 301 redirect (permanent)
            force: true, // Ensures the redirect happens even if the fromPath exists
          },
        ],
      },
    },
  ],
};
