import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HomeHero from '../components/Global/HomeHero/HomeHero';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';

const IndexPage = ({ pageContext, data: { page, cslHighlightEvent, configuration, favicon } }) => {
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

        {page?.blocks && (
          <div className="container">
            <Blocks blocks={page.blocks} context={{ cslHighlightEvent }} isHomepage />
          </div>
        )}
      </WrapperLayout>
    </Layout>
  );
};

export default IndexPage;

export const HomeQuery = graphql`
  query Home($cslHighlightedEvent: String, $language: String!) {
    locales: allLocale(filter: { ns: { in: ["index"] }, language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    cslHighlightEvent: externalEvent(slug: { eq: $cslHighlightedEvent }) {
      __typename
      id: slug
      slug
      title
      description
      start_at
      end_at
      raw_start
      raw_end
      image_url
      labels
      start_in_zone
      end_in_zone
      location {
        latitude
        longitude
        venue
        query
        region
      }
      calendar {
        name
        slug
      }
      hiddenAddress
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
      }
    }
  }
`;
