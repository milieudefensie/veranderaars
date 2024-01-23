require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
  siteMetadata: {
    title: `Milieudefensie`,
    siteUrl: `https://milieudefensie-preview.netlify.app`,
  },
  plugins: [
    {
      resolve: 'gatsby-source-datocms',
      options: {
        apiToken: process.env.DATO_API_TOKEN,
        previewMode: process.env.NODE_ENV !== 'production',
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
  ],
};
