import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/StructuredTextDefault';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import { ReactSVG } from 'react-svg';
import Link from '../components/Global/Link/Link';
import backBtnIcon from '../components/Icons/back-btn.svg';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import TagList from '../components/Global/Tag/TagList';
import { formatDate } from '../utils';

import './basic.styles.scss';

const Event = ({ pageContext, data: { page, listEvent, favicon } }) => {
  const {
    seo,
    title,
    introduction,
    hourStart,
    hourEnd,
    date,
    address,
    registrationForm,
    formBackgroundColor,
    whatsappGroup,
    shareMessage,
    image,
    content,
    tags = [],
  } = page;

  const [shareWpText, setShareWpText] = useState('');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    // Share WP
    const currentURL = encodeURIComponent(window.location.href);
    setShareWpText(shareMessage ? `https://wa.me/?text=${shareMessage}` : `https://wa.me/?text=${currentURL}`);
  }, []);

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic image={image} overlay={false} />

        <FloatLayout reduceOverlap>
          {listEvent && (
            <div className="pre-header">
              <div className="back-btn">
                <Link to={listEvent}>
                  <img src={backBtnIcon} alt="Back button icon" />
                  <span>Alle evenementen</span>
                </Link>
              </div>

              {Array.isArray(tags) && <TagList tags={tags} />}
            </div>
          )}

          {title && <h1>{title}</h1>}

          {/* Form  */}
          {registrationForm && (
            <div className={`form-wrapper ${formBackgroundColor}`}>
              <HubspotForm {...registrationForm} style={`${formBackgroundColor === 'dark-green' ? '' : 'event'}`} />
            </div>
          )}

          {/* Brief information */}
          <div className="brief-information">
            <div className="metadata">
              {date && (
                <span>
                  <img src={dateIcon} alt="Date icon" />
                  <span>{formatDate(date)}</span>
                </span>
              )}

              {hourStart && (
                <span>
                  <img src={hourIcon} alt="Hour icon" />
                  <span>
                    {hourStart ? hourStart : ''} {hourEnd ? ` - ${hourEnd}` : ''}
                  </span>
                </span>
              )}

              {address && (
                <span>
                  <img src={locationIcon} alt="Location icon" />
                  <span>{address}</span>
                </span>
              )}
            </div>

            {(shareWpText || whatsappGroup) && (
              <a className="wp-button" href={shareWpText || whatsappGroup} target="_blank" rel="noopener noreferrer">
                <span>Deel op WhatsApp</span>
                <ReactSVG src={wpIcon} alt="Wp icon" />
              </a>
            )}
          </div>

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

export default Event;

export const PageQuery = graphql`
  query EventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
    page: datoCmsEvent(id: { eq: $id }) {
      id
      title
      slug
      externalLink
      date
      hourStart
      hourEnd
      address
      region
      whatsappGroup
      shareMessage
      registrationForm {
        ... on DatoCmsHubspot {
          formId
          region
          portalId
          columns
        }
      }
      formBackgroundColor
      tags {
        ... on DatoCmsTag {
          id
          title
        }
      }
      introduction
      image {
        gatsbyImageData
        url
      }
      content {
        value
        blocks {
          __typename
          ... on DatoCmsNarrativeBlock {
            id: originalId
            preTitle
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
              ... on DatoCmsCta {
                id
                title
                style
                link {
                  ... on DatoCmsGlobalLink {
                    id
                    content {
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
            }
          }
          ... on DatoCmsHighlightEvent {
            id: originalId
            sectionTitle
            cta {
              ... on DatoCmsCta {
                id
                title
                style
                link {
                  ... on DatoCmsGlobalLink {
                    id
                    content {
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
                  ... on DatoCmsCta {
                    id
                    title
                    style
                    link {
                      ... on DatoCmsGlobalLink {
                        id
                        content {
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
            whatsappGroup
            socialLinks {
              ... on DatoCmsSocialLink {
                id
                title
                url
                socialNetwork
              }
            }
            ctas {
              ... on DatoCmsCta {
                id
                title
                style
                link {
                  ... on DatoCmsGlobalLink {
                    id
                    label
                    externalUrl
                    content {
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
