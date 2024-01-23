import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import SimpleText from '../components/Blocks/SimpleText/SimpleText';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';

const Page = ({ pageContext, data: { page, favicon } }) => {
  const {
    seo,
    title,
    introduction,
    showDarkOverlay = true,
    reduceOverlap = false,
    backgroundColor,
    heroBackgroundImage,
    blocks = [],
    floatingLayout = false,
  } = page;

  const renderMainContent = () => (
    <>
      {introduction && (
        <SimpleText
          limitedWidth
          block={{ text: introduction }}
          container={!floatingLayout}
          extraClassNames={floatingLayout ? 'introduction' : 'introduction-normal'}
        />
      )}
      <Blocks blocks={blocks} />
    </>
  );

  return (
    <Layout heroBgColor={backgroundColor}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <div className="inner-page" style={{ backgroundColor: '#FFF' }}>
        <HeroBasic
          title={floatingLayout ? '' : title}
          image={heroBackgroundImage}
          backgroundColor={backgroundColor}
          overlay={showDarkOverlay}
        />

        {floatingLayout ? (
          <FloatLayout reduceOverlap={reduceOverlap}>
            <h1>{title}</h1>
            {renderMainContent()}
          </FloatLayout>
        ) : (
          <>{renderMainContent()}</>
        )}
      </div>
    </Layout>
  );
};

export default Page;

export const PageQuery = graphql`
  query PageById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    page: datoCmsBasicPage(id: { eq: $id }) {
      title
      introduction
      backgroundColor
      showDarkOverlay
      reduceOverlap
      heroBackgroundImage {
        url
        gatsbyImageData
      }
      floatingLayout
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
      blocks {
        ... on DatoCmsNarrativeBlock {
          ...BlockNarrativeBlock
        }
        ... on DatoCmsAcordion {
          ...BlockAccordion
        }
        ... on DatoCmsSimpleText {
          ...BlockText
        }
        ... on DatoCmsVideoBlock {
          ...BlockVideo
        }
        ... on DatoCmsTable {
          ...BlockTable
        }
        ... on DatoCmsHighlightTool {
          ...BlockHighlightTools
        }
        ... on DatoCmsTextHubspotForm {
          ...BlockTextHubspot
        }
        ... on DatoCmsShare {
          ...BlockShare
        }
      }
    }
  }
`;
