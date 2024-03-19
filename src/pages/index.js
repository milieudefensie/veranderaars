import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HomeHero from '../components/Global/HomeHero/HomeHero';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';

const IndexPage = ({ data: { page, favicon } }) => {
  return (
    <Layout extraClassNames="homepage-md">
      {page?.seo && <SeoDatoCMS seo={page?.seo} favicon={favicon} homepage />}

      <WrapperLayout variant="white">
        <HomeHero
          title={page?.title}
          subtitle={page?.subtitle}
          image={page?.heroImage}
          mobileImage={page?.mobileHeroImage}
          form={page?.form}
        />

        {page?.blocks && <Blocks blocks={page.blocks} isHomepage />}
      </WrapperLayout>
    </Layout>
  );
};

export default IndexPage;

export const HomeQuery = graphql`
  query Home {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    page: datoCmsHome {
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
      id
      title
      subtitle
      heroImage {
        gatsbyImageData(width: 1500, height: 800)
      }
      mobileHeroImage {
        gatsbyImageData
      }
      form {
        id
        formId
        portalId
        region
        internalName
        columns
      }
      blocks {
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
      }
    }
  }
`;
