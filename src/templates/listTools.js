import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import SimpleText from '../components/Blocks/SimpleText/SimpleText';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';

const ListTool = ({ pageContext, data: { page, favicon } }) => {
  const { seo, title, introduction, backgroundColor, heroBackgroundImage, blocks = [] } = page;

  return (
    <Layout heroBgColor={backgroundColor}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic
          image={heroBackgroundImage}
          backgroundColor={backgroundColor}
          responsiveVariant="tools"
          overlay={false}
        />

        <FloatLayout reduceOverlap>
          <h1 className="main-heading">{title}</h1>
          {introduction && <SimpleText limitedWidth block={{ text: introduction }} extraClassNames="single" />}
          <Blocks blocks={blocks} />
        </FloatLayout>
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
        ... on DatoCmsMap {
          ...BlockMap
        }
        ... on DatoCmsColumn {
          ...BlockColumns
        }
        ... on DatoCmsCountdown {
          ...BlockCountdown
        }
        ... on DatoCmsCtaList {
          ...BlockCtaList
        }
        ... on DatoCmsCtaIconsList {
          ...BlockCtaIconsList
        }
        ... on DatoCmsImageGallery {
          ...BlockImageGallery
        }
        ... on DatoCmsNarrativeBlock {
          ...BlockNarrativeBlock
        }
        ... on DatoCmsHighlightEvent {
          ...BlockHighlightEvent
        }
        ... on DatoCmsHighlightTool {
          ...BlockHighlightTools
        }
        ... on DatoCmsTextHubspotForm {
          ...BlockTextHubspot
        }
        ... on DatoCmsTable {
          ...BlockTable
        }
        ... on DatoCmsShare {
          ...BlockShare
        }
        ... on DatoCmsImage {
          ...BlockImage
        }
        ... on DatoCmsEmbedIframe {
          ...BlockEmbedIframe
        }
        ... on DatoCmsAcordion {
          ...BlockAccordion
        }
        ... on DatoCmsVideoBlock {
          ...BlockVideo
        }
        ... on DatoCmsSimpleText {
          ...BlockText
        }
        ... on DatoCmsBlockCta {
          ...BlockCustomCta
        }
        ... on DatoCmsMap {
          ...BlockMap
        }
      }
    }
  }
`;
