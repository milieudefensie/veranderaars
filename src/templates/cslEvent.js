import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';


const CSLEvent = ({ data: { page, favicon }}) => {
  const { title, image_url, description } = page;
  return (
    <Layout>
      <SeoDatoCMS favicon={favicon}>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta name="description" content={title} />
        <meta property="og:description" content={title} />
        <meta name="twitter:description" content={title} />
      </SeoDatoCMS>

      <WrapperLayout variant="white">
        <HeroBasic image={{ url: image_url }} />
          <FloatLayout>
            {title && <h1>{title}</h1>}
            {description && (
              <div className="content">
                <p dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
          </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default CSLEvent;

export const PageQuery = graphql`
  query CslEventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    page: externalEvent(id: { eq: $id }) {
      title
      image_url
      description
    }
  }
`;
