import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/StructuredTextDefault';
import Link from '../components/Global/Link/Link';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import backBtnIcon from '../components/Icons/back-btn.svg';
import type { ToolTemplate } from '../types';

import './basic.styles.scss';

type ToolPageProps = PageProps<ToolTemplate>;

const Tool: React.FC<ToolPageProps> = ({ data: { page, listTool, favicon } }) => {
  const { seo, title, introduction, heroImage, content } = page;

  return (
    <Layout heroBgColor={heroImage ? '' : 'green'}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="toolkit-page white">
        <HeroBasic image={heroImage} overlay={false} />

        <FloatLayout reduceOverlap>
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
      </WrapperLayout>
    </Layout>
  );
};

export default Tool;

export const PageQuery = graphql`
  query ToolById($id: String, $language: String!) {
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
      heroImage {
        gatsbyImageData
        url
      }
      content {
        value
        blocks {
          __typename
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
            id: originalId
            title
            alignment
            textContent
            backgroundColor
            image {
              gatsbyImageData(width: 800)
              alt
              url
            }
            xlImage: image {
              gatsbyImageData(width: 1200)
              alt
              url
            }
            imageMobile {
              gatsbyImageData(width: 500)
              alt
              url
            }
            video {
              id
              source {
                url
                thumbnailUrl
              }
              preview {
                gatsbyImageData
                url
              }
            }
            ctas {
              ...AppCta
            }
          }
          ... on DatoCmsHighlightEvent {
            id: originalId
            sectionTitle
            cta {
              ...AppCta
            }
            items {
              ... on DatoCmsEvent {
                id
                title
                slug
                externalLink
                introduction
                date
                hourStart
                hourEnd
                onlineEvent
                tags {
                  ... on DatoCmsTag {
                    id
                    title
                  }
                }
                image {
                  gatsbyImageData(width: 900, height: 505)
                }
                model {
                  apiKey
                }
              }
            }
          }
          ... on DatoCmsHighlightTool {
            id: originalId
            sectionTitle
            items {
              ... on DatoCmsToolItem {
                id
                title
                introduction
                image {
                  gatsbyImageData(width: 900, height: 505)
                }
                icon {
                  url
                }
                iconFontPicker
                backgroundColor
                cta {
                  ...AppCta
                }
              }
            }
          }
          ... on DatoCmsTextHubspotForm {
            id: originalId
            title
            description
            hubspot {
              ... on DatoCmsHubspot {
                formId
                region
                portalId
                columns
                trackErrors
              }
            }
          }
          ... on DatoCmsTable {
            id: originalId
            table
          }
          ... on DatoCmsShare {
            id: originalId
            title
            socialLinks {
              ... on DatoCmsSocialLink {
                id
                url
                socialNetwork
              }
            }
          }
          ... on DatoCmsEmbedIframe {
            id: originalId
            iframeCode
          }
          ... on DatoCmsVideoBlock {
            id: originalId
            video {
              url
              thumbnailUrl
            }
          }
          ... on DatoCmsBlockCta {
            id: originalId
            title
            style
            alignment
            link {
              ... on DatoCmsGlobalLink {
                id
                label
                externalUrl
                content {
                  __typename
                  ... on DatoCmsListTool {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsBasicPage {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsEvent {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsListEvent {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsListGroup {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsTool {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                  ... on DatoCmsGroup {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
                }
              }
            }
          }
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
