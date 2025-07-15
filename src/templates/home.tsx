import * as React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import Blocks from '../components/blocks';
import HomeHero from '../components/Global/HomeHero/home-hero';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import type { HomepageTemplate } from '../types';

const IndexPage: React.FC<PageProps<HomepageTemplate>> = ({
  pageContext,
  data: { page, cslHighlightEvent, favicon },
}) => {
  return (
    <Layout extraClassNames="homepage-md">
      {page?.seo && <SeoDatoCMS seo={page?.seo} favicon={favicon} homepage />}

      <WrapperLayout variant="white">
        <HomeHero
          title={page?.title}
          subtitle={page?.subtitle}
          image={page?.heroImage}
          mobileImage={page?.mobileHeroImage}
          form={page?.formStep}
        />

        {page?.blocks && (
          <div className="container">
            <Blocks blocks={page.blocks} context={{ cslHighlightEvent, buildContext: pageContext }} isHomepage />
          </div>
        )}
      </WrapperLayout>
    </Layout>
  );
};

export default IndexPage;

export const HomeQuery = graphql`
  query Home($cslHighlightedEvent: String) {
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
      formStep {
        ...FormStepBlock
      }
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
        ...BlockNarrativeBlock
        ...BlockHighlightEvent
        ...BlockHighlightTools
        ...BlockTextHubspot
        ...BlockTable
        ...BlockShare
        ...BlockImage
        ...BlockEmbedIframe
        ...BlockAccordion
        ...BlockVideo
        ...BlockText
        ...BlockCustomCta
        ...BlockMap
        ...BlockColumns
        ...BlockCountdown
        ...BlockCtaList
        ...BlockCtaIconsList
        ...BlockImageGallery
      }
    }
  }
`;
