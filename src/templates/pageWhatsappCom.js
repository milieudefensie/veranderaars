import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import Blocks from '../components/Blocks';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import SimpleText from '../components/Blocks/SimpleText/SimpleText';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
// import { BotProtectionProvider, BotProtectionStatus } from '../components/Global/BotProtection/BotProtection';
// import { ProtectedLink } from '../components/Global/BotProtection/BotProtection';
import Cta from '../components/Global/Cta/Cta';

const Page = ({ pageContext, data: { page, favicon } }) => {
  const { seo, title, introduction, backgroundColor, heroBackgroundImage, blocks = [] } = page;

  const ctaBlocks = blocks.filter(block => block.__typename === 'DatoCmsBlockCta');
  const otherBlocks = blocks.filter(block => block.__typename !== 'DatoCmsBlockCta');

  return (
    <Layout heroBgColor={backgroundColor}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <div className="inner-page" style={{ backgroundColor: '#FFF' }}>
        <HeroBasic image={heroBackgroundImage} backgroundColor={backgroundColor} overlay={false} />

        <FloatLayout reduceOverlap>
          
          <h1>{title}</h1>
          
            <SimpleText
              limitedWidth
              block={{ text: introduction }}
              container={false}
              extraClassNames={true ? 'introduction' : 'introduction-normal'}
            />

          <div className='row mb-5'>
            <Blocks blocks={otherBlocks} />
          </div>
          
          {/* <BotProtectionProvider
            turnstileMode="managed"
            onVerificationComplete={(success) => {
              console.log('Verification status:', success);
            }}
          >
            <div className='row mt-5'>
              {ctaBlocks.map((block, index) => {
                if (block.__typename === 'DatoCmsBlockCta') { 
                    return (
                      <div className='col-md-6 mb-3'>
                        <ProtectedLink 
                          to={ block.link.externalUrl }
                          className="custom-btn custom-btn-primary w-100"
                        >
                          { block.title }
                        </ProtectedLink>
                      </div>
                    )
                }
              })}
            </div>
            
            <BotProtectionStatus />
          </BotProtectionProvider> */}

            <div className='row mt-5'>
              {ctaBlocks.map((block, index) => {
                if (block.__typename === 'DatoCmsBlockCta') { 
                    return (
                      <div className='col-md-6 mb-3'>
                        <Cta cta={block} />
                        {/* <ProtectedLink 
                          to={ block.link.externalUrl }
                          className="custom-btn custom-btn-primary w-100"
                        >
                          { block.title }
                        </ProtectedLink> */}
                      </div>
                    )
                }
              })}
            </div>
          
        </FloatLayout>
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
      heroBackgroundImage {
        url
        gatsbyImageData
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
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
        ... on DatoCmsMap {
          ...BlockMap
        }
        ... on DatoCmsBlockCta {
          ...BlockCustomCta
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
