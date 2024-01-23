import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import SimpleText from '../components/Blocks/SimpleText/SimpleText';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';

const ListTool = ({ pageContext, data: { page, favicon } }) => {
  const { seo, title, introduction, backgroundColor, heroBackgroundImage, blocks = [] } = page;

  return (
    <Layout heroBgColor={backgroundColor}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic
          title={title}
          image={heroBackgroundImage}
          backgroundColor={backgroundColor}
          responsiveVariant="tools"
        />
        {introduction && <SimpleText limitedWidth block={{ text: introduction }} extraClassNames="single" />}
        <Blocks blocks={blocks} />
      </WrapperLayout>
    </Layout>
  );
};

export default ListTool;

export const PageQuery = graphql`
  query ListToolById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    page: datoCmsListTool(id: { eq: $id }) {
      title
      introduction
      backgroundColor
      heroBackgroundImage {
        url
        gatsbyImageData
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
      blocks {
        ... on DatoCmsHighlightTool {
          ...BlockHighlightTools
        }
        ... on DatoCmsTextHubspotForm {
          ...BlockTextHubspot
        }
      }
    }
  }
`;
