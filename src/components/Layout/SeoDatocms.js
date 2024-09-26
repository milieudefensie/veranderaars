import React from 'react';
import { HelmetDatoCms } from 'gatsby-source-datocms';

const SeoDatoCMS = ({ seo, favicon = null, homepage = false, children }) => {
  if (homepage) {
    seo.tags[0].content = seo.tags[0].content.replace('- Milieudefensie', '');
  }

  return (
    <HelmetDatoCms seo={seo} favicon={favicon?.faviconMetaTags}>
      {children}

      <link rel="icon" type="image/x-icon" href="https://www.datocms-assets.com/115430/1707748957-icon.svg"/>
    </HelmetDatoCms>
  );
};

export default SeoDatoCMS;
