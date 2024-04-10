import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/StructuredTextDefault';
import emailIcon from '../components/Icons/email.svg';
import messageIcon from '../components/Icons/message.svg';
import organizerIcon from '../components/Icons/organizer.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import { ReactSVG } from 'react-svg';
import Link from '../components/Global/Link/Link';
import backBtnIcon from '../components/Icons/back-btn.svg';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import TagList from '../components/Global/Tag/TagList';
import ListHighlightEvent from '../components/Blocks/HighlightEvent/ListHighlightEvent';
import { haversine, mapCmsEvents } from '../utils';
import useCSLEvents from '../hooks/useCSLEvents';
import Spinner from '../components/Global/Spinner/Spinner';

import './basic.styles.scss';

const Group = ({ pageContext, data: { page, allEvents = [], listGroup, listEvent, favicon } }) => {
  const {
    seo,
    title,
    introduction,
    registrationForm,
    image,
    content,
    email,
    whatsappGroup,
    organizer,
    coordinates,
    tags = [],
    relatedEvents = [],
  } = page;

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';
  }, []);

  const cmsEvents = mapCmsEvents(allEvents);
  const { mergedEvents, status } = useCSLEvents(cmsEvents);
  const isLoading = status === 'loading';

  const groupHasCoordinates = coordinates && coordinates.latitude && coordinates.longitude;
  const maxDistanceInKilometers = 50;
  const nearbyEvents = groupHasCoordinates
    ? mergedEvents
        .filter((event) => {
          return (
            haversine(
              coordinates.latitude,
              coordinates.longitude,
              event.coordinates.latitude,
              event.coordinates.longitude
            ) <= maxDistanceInKilometers
          );
        })
        .slice(0, 3)
    : [];

  const related = Array.isArray(relatedEvents) && relatedEvents.length > 0;
  const hasRelatedEvents = related || nearbyEvents.length > 0;

  return (
    <Layout heroBgColor={image ? '' : 'green'}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic image={image} overlay={false} />
        <FloatLayout reduceOverlap>
          {listGroup && (
            <div className="pre-header">
              <div className="back-btn">
                <Link to={listGroup}>
                  <img src={backBtnIcon} alt="Back button icon" />
                  <span>Bekijk alle groepen</span>
                </Link>
              </div>

              {Array.isArray(tags) && <TagList tags={tags} />}
            </div>
          )}

          {title && <h1>{title}</h1>}
          {introduction && <div className="alt-introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}

          {/* Form  */}
          {registrationForm && (
            <div className="form-wrapper">
              <HubspotForm {...registrationForm} style="event" />
            </div>
          )}

          {/* Brief information */}
          {(email || whatsappGroup || organizer) && (
            <div className="brief-information">
              <div className="metadata">
                {email && (
                  <span>
                    <img src={emailIcon} alt="Email icon" />
                    <span>
                      <a href={`mailto:${email}`}>{email}</a>
                    </span>
                  </span>
                )}

                {whatsappGroup && (
                  <span>
                    <img src={messageIcon} alt="Whatsapp Group icon" />
                    <span>
                      <a href={`${whatsappGroup}`} target="_blank" rel="noopener noreferrer">
                        WhatsApp groep
                      </a>
                    </span>
                  </span>
                )}

                {organizer && (
                  <span>
                    <img src={organizerIcon} alt="Organizer icon" />
                    <span>Lokale organizer: {organizer}</span>
                  </span>
                )}
              </div>

              {whatsappGroup && (
                <div>
                  <a
                    className="wp-button stretched"
                    href={`${whatsappGroup}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>WhatsApp groep</span>
                    <ReactSVG src={wpIcon} alt="Wp icon" />
                  </a>
                </div>
              )}
            </div>
          )}

          {content?.value && (
            <div className="content">
              <StructuredTextDefault content={content} />
            </div>
          )}
        </FloatLayout>

        {/* Related events */}
        {isLoading ? (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Spinner />
          </div>
        ) : (
          hasRelatedEvents && (
            <div className="related-section">
              <ListHighlightEvent
                block={{
                  sectionTitle: related ? 'Evenementen van deze groep' : 'Evenementen in de buurt',
                  cta: [{ ...listEvent, title: 'Bekijk alle evenementen' }],
                  items: related ? relatedEvents : nearbyEvents,
                }}
              />
            </div>
          )
        )}
      </WrapperLayout>
    </Layout>
  );
};

export default Group;

export const PageQuery = graphql`
  query GroupById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listGroup: datoCmsListGroup {
      id
      slug
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
    allEvents: allDatoCmsEvent {
      edges {
        node {
          id
          slug
          title
          externalLink
          introduction
          date
          rawDate: date
          hourStart
          hourEnd
          onlineEvent
          region
          coordinates {
            latitude
            longitude
          }
          tags {
            ... on DatoCmsTag {
              id
              title
            }
          }
          image {
            url
            gatsbyImageData
          }
          model {
            apiKey
          }
        }
      }
    }
    page: datoCmsGroup(id: { eq: $id }) {
      id
      title
      slug
      address
      email
      whatsappGroup
      organizer
      introduction
      registrationForm {
        ... on DatoCmsHubspot {
          formId
          region
          portalId
          columns
        }
      }
      image {
        gatsbyImageData
        url
      }
      coordinates {
        latitude
        longitude
      }
      content {
        value
        blocks {
          __typename
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
      tags {
        ... on DatoCmsTag {
          id
          title
        }
      }
      relatedEvents {
        ... on DatoCmsEvent {
          id
          title
          slug
          externalLink
          introduction
          date
          hourStart
          hourEnd
          address
          tags {
            ... on DatoCmsTag {
              id
              title
            }
          }
          image {
            gatsbyImageData
          }
          model {
            apiKey
          }
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
