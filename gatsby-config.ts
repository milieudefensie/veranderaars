import type { GatsbyConfig } from 'gatsby';

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  trailingSlash: 'never',
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
        // environment: process.env.DATO_ENVIRONMENT ? process.env.DATO_ENVIRONMENT : '',
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
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-intl`,
      options: {
        path: `${__dirname}/locales`,
        languages: [`nl`, `en`],
        defaultLanguage: `nl`,
        redirect: false,
      },
    },
  ],
};

export default config;
