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
            othersSignalGroups={data.signalGroups.nodes.map((g: any) => g)}
            customShareMessage
            shareWpText=""
            //             shareWpText={`https://wa.me/?text=${encodeURIComponent(`Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit ${city}?
            // https://milieudefensie.nl/doe-mee/klimaatmars-2025?utm_medium=social&utm_source=whatsapp
            // http://veranderaars.milieudefensie.nl/samenreizen?utm_medium=social&utm_source=whatsapp`)`}
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
