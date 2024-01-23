import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/StructuredTextDefault';
import Link from '../components/Global/Link/Link';
import backBtnIcon from '../components/Icons/back-btn.svg';
import Blocks from '../components/Blocks';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';

import './event.styles.scss';

const Tool = ({ pageContext, data: { page, listTool, favicon } }) => {
  const {
    seo,
    title,
    introduction,
    showDarkOverlay = true,
    reduceOverlap = false,
    heroImage,
    content,
    blocks = [],
  } = page;

  return (
    <Layout heroBgColor={heroImage ? '' : 'green'}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic image={heroImage} overlay={showDarkOverlay} />

        {/* Main information */}
        <FloatLayout reduceOverlap={reduceOverlap}>
          <div className="pre-header">
            <div className="back-btn">
              <Link to={listTool}>
                <img src={backBtnIcon} alt="Back button icon" />
                <span>Toolkit</span>
              </Link>
            </div>
          </div>

          <h1 className="main-heading">{title}</h1>

          {introduction && <div className="introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}

          {content?.value && (
            <div className="content">
              <StructuredTextDefault content={content} />
            </div>
          )}
        </FloatLayout>

        {/* Additional blocks */}
        {Array.isArray(blocks) && <Blocks blocks={blocks} />}
      </WrapperLayout>
    </Layout>
  );
};

export default Tool;

export const PageQuery = graphql`
  query ToolById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listTool: datoCmsListTool {
      id
      slug
      model {
        apiKey
      }
    }
    page: datoCmsTool(id: { eq: $id }) {
      id
      title
      slug
      introduction
      showDarkOverlay
      reduceOverlap
      heroImage {
        gatsbyImageData
        url
      }
      blocks {
        ... on DatoCmsHighlightTool {
          ...BlockHighlightTools
        }
        ... on DatoCmsTextHubspotForm {
          ...BlockTextHubspot
        }
      }
      content {
        value
        blocks {
          __typename
          ... on DatoCmsImage {
            id: originalId
            image {
              gatsbyImageData(width: 700)
              title
              url
            }
          }
          ... on DatoCmsAcordion {
            id: originalId
            items {
              ... on DatoCmsAcordionItem {
                id
                title
                text
              }
            }
          }
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
