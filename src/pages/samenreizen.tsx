import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import TravelTogether from '../components/Layout/travel-together/travel-together';
import { HelmetDatoCms } from 'gatsby-source-datocms';

const TravelTogetherPage: React.FC<PageProps> = ({ data }) => {
  return (
    <Layout>
      <HelmetDatoCms seo={data.favicon.faviconMetaTags}>
        <title>Samenreizen</title>
      </HelmetDatoCms>

      <WrapperLayout variant={`white event-detail`}>
        <div className="container">
          <TravelTogether
            slug={'samenreizen'}
            othersSignalGroups={data.signalGroups.nodes.map((g) => g)}
            shareWpText={`https://wa.me/?text=${encodeURIComponent(`Lijkt het je leuk om hier samen met mij heen te gaan? https://veranderaars.milieudefensie.nl/samenreizen?utm_medium=social&utm_source=whatsapp`)}`}
          />
        </div>
      </WrapperLayout>
    </Layout>
  );
};

export default TravelTogetherPage;

export const TravelTogetherQuery = graphql`
  query TravelTogether {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    signalGroups: allDatoCmsSignalGroup {
      nodes {
        id
        internalName
        url
      }
    }
  }
`;
