import * as React from 'react';
import type { GatsbySSR } from 'gatsby';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: 'nl' });

  setHeadComponents([
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />,
    <link
      rel="preload"
      href="/fonts/lato/Lato-Black.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="latoBlack"
    />,
    <link
      rel="preload"
      href="/fonts/lato/Lato-Bold.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="latoBold"
    />,
    <link
      rel="preload"
      href="/fonts/lato/Lato-Regular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="latoRegular"
    />,
    <link
      rel="preload"
      href="/fonts/lato/Lato-Light.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="latoLight"
    />,
    <link
      rel="preload"
      href="/fonts/lato/Lato-Thin.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="latoThin"
    />,
  ]);
};
