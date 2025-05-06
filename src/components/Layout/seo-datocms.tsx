// components/Layout/SeoDatoCMS.tsx

import React, { ReactNode } from 'react';
import { HelmetDatoCms } from 'gatsby-source-datocms';

interface SeoDatoCMSProps {
  seo: {
    tags: Array<{ tagName: string; content: string; [key: string]: any }>;
  };
  favicon?: { faviconMetaTags: any } | null;
  homepage?: boolean;
  children?: ReactNode;
}

const SeoDatoCMS: React.FC<SeoDatoCMSProps> = ({ seo, favicon = null, homepage = false, children }) => {
  if (homepage && seo.tags.length > 0 && typeof seo.tags[0].content === 'string') {
    seo.tags[0].content = seo.tags[0].content.replace('- Milieudefensie', '');
  }

  return (
    <HelmetDatoCms seo={seo} favicon={favicon?.faviconMetaTags}>
      {children}
      <link rel="icon" type="image/x-icon" href="https://www.datocms-assets.com/115430/1707748957-icon.svg" />
    </HelmetDatoCms>
  );
};

export default SeoDatoCMS;
