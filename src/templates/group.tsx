import React, { useEffect } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import { ReactSVG } from 'react-svg';
import Link from '../components/Global/Link/link';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import TagList from '../components/Global/Tag/tag-list';
import ListHighlightEvent from '../components/Blocks/HighlightEvent/list-highlight-event'; // @ts-expect-error
import { isArray, mapCmsEvents, mapCslEvents } from '../utils'; // @ts-expect-error
import useCSLEvents from '../hooks/useCSLEvents';
import FormSteps from '../components/Global/FormSteps/FormSteps';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
// @ts-expect-error
import emailIcon from '../components/Icons/email.svg'; // @ts-expect-error
import messageIcon from '../components/Icons/message.svg'; // @ts-expect-error
import organizerIcon from '../components/Icons/organizer.svg'; // @ts-expect-error
import wpIcon from '../components/Icons/signal-dark.svg'; // @ts-expect-error
import backBtnIcon from '../components/Icons/back-btn.svg';
import { GroupTemplate } from '../types';

import './basic.styles.scss';

type GroupProps = PageProps<GroupTemplate> & {
  pageContext: {
    language: string;
  };
};

const Group: React.FC<GroupProps> = ({
  pageContext,
  data: { page, allEvents = { edges: [] }, allCSLEvents = { edges: [] }, listGroup, listEvent, favicon },
}) => {
  const {
    seo,
    title,
    introduction,
    registrationForm,
    image,
    content,
    email,
    signalChat,
    organizer,
    coordinates,
    tags = [],
    relatedEvents = [],
    localGroupId,
    alternativeHero = false,
    formSteps,
  } = page;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      htmlElement.style.overflow = '';
    }
  }, []);

  const cmsEvents = mapCmsEvents(allEvents);
  const cslEvents = mapCslEvents(allCSLEvents);
  const { mergedEvents } = useCSLEvents(cmsEvents, cslEvents);

  const groupHasCoordinates = Boolean(coordinates?.latitude && coordinates?.longitude);
  const nearbyEvents = groupHasCoordinates ? mergedEvents : [];

  const related = Array.isArray(relatedEvents) && relatedEvents.length > 0;
  const hasRelatedEvents = related || nearbyEvents.length > 0;

  const hubspotFormSetGroupId = () => {
    if (!localGroupId || typeof document === 'undefined') {
      console.warn('Local group ID not found or running in SSR');
      return;
    }

    const localGroupInput = document.querySelector<HTMLInputElement>('input[name="local_group_id__voor_formulieren_"]');
    if (localGroupInput) {
      localGroupInput.value = localGroupId;
    } else {
      console.warn('Local group ID input not found');
    }
  };

  const withFormsSteps = isArray(formSteps);

  return (
    <Layout heroBgColor={image ? '' : 'green'}>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant={`white ${withFormsSteps ? 'event-detail' : ''}`}>
        {withFormsSteps ? (
          <FormSteps
            title={title}
            description={introduction}
            bgImageUrl={image?.url}
            form={formSteps}
            variant="green group"
            headerComponents={
              <>
                {listGroup && (
                  <div className="pre-header">
                    <div className="back-btn">
                      <Link to={listGroup}>
                        <img src={backBtnIcon} alt="Back button icon" width={17} height={13} />
                        <span>Bekijk alle groepen</span>
                      </Link>
                    </div>

                    {Array.isArray(tags) && <TagList tags={tags} />}
                  </div>
                )}
              </>
            }
            extraLogic={hubspotFormSetGroupId}
          />
        ) : (
          <HeroBasic image={image} overlay={false} />
        )}

        <FloatLayout reduceOverlap alternative={alternativeHero}>
          {!withFormsSteps && (
            <>
              {listGroup && (
                <div className="pre-header">
                  <div className="back-btn">
                    <Link to={listGroup}>
                      <img src={backBtnIcon} alt="Back button icon" width={17} height={13} />
                      <span>Bekijk alle groepen</span>
                    </Link>
                  </div>

                  {Array.isArray(tags) && <TagList tags={tags} />}
                </div>
              )}

              {title && <h1 className="main-heading title-hero-alternative">{title}</h1>}
              {introduction && <div className="alt-introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}
              {registrationForm && (
                <div className="form-wrapper">
                  <HubspotForm {...registrationForm} style="event" extraLogic={hubspotFormSetGroupId} />
                </div>
              )}
            </>
          )}

          {/* Brief information */}
          {(email || signalChat || organizer) && (
            <div className="brief-information">
              <div className="metadata">
                {email && (
                  <span>
                    <img src={emailIcon} alt="Email icon" width={24} height={24} />
                    <span>
                      <a href={`mailto:${email}`}>{email}</a>
                    </span>
                  </span>
                )}

                {signalChat && (
                  <span>
                    <img src={messageIcon} alt="Signal Group icon" width={24} height={24} />
                    <span>
                      <a href={`${signalChat}`} target="_blank" rel="noopener noreferrer">
                        Signal chat
                      </a>
                    </span>
                  </span>
                )}

                {organizer && (
                  <span>
                    <img src={organizerIcon} alt="Organizer icon" width={24} height={24} />
                    <span>Lokale organizer: {organizer}</span>
                  </span>
                )}
              </div>

              {signalChat && (
                <div>
                  <a className="wp-button stretched" href={`${signalChat}`} target="_blank" rel="noopener noreferrer">
                    <span>Signal chat</span>
                    <ReactSVG src={wpIcon} alt="Signal icon" />
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

        {hasRelatedEvents && (
          <div className="related-section">
            <div className="container">
              <ListHighlightEvent
                block={{
                  sectionTitle: related ? 'Evenementen van deze groep' : 'Evenementen in de buurt',
                  cta: [{ ...listEvent, title: 'Bekijk alle evenementen' }],
                  items: related ? relatedEvents : nearbyEvents,
                }}
              />
            </div>
          </div>
        )}
      </WrapperLayout>
    </Layout>
  );
};

export default Group;

export const PageQuery = graphql`
  query GroupById($id: String, $currentDate: Date!, $maxLat: Float, $minLat: Float, $maxLon: Float, $minLon: Float) {
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
    allCSLEvents: allExternalEvent(
      filter: {
        cancelled_at: { eq: null }
        start_at: { gte: $currentDate }
        location: { latitude: { lte: $maxLat, gte: $minLat }, longitude: { lte: $maxLon, gte: $minLon } }
      }
      limit: 10
    ) {
      edges {
        node {
          ...CSLEventCard
        }
      }
    }
    allEvents: allDatoCmsEvent(
      filter: {
        closeEvent: { ne: true }
        date: { gte: $currentDate }
        coordinates: { latitude: { lte: $maxLat, gte: $minLat }, longitude: { lte: $maxLon, gte: $minLon } }
      }
      limit: 10
    ) {
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
      localGroupId
      address
      email
      whatsappGroup
      signalChat
      organizer
      introduction
      alternativeHero
      formSteps {
        ...FormStepBlock
      }
      registrationForm {
        ... on DatoCmsHubspot {
          id
          formId
          region
          portalId
          columns
          trackErrors
          disclaimerText
          introductionText
          title
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
          ...BlockMap
          ...BlockColumns
          ...BlockCountdown
          ...BlockCtaList
          ...BlockCtaIconsList
          ...BlockImageGallery
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
            variant
            hubspot {
              ... on DatoCmsHubspot {
                id
                formId
                region
                portalId
                columns
                trackErrors
                disclaimerText
                introductionText
                title
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
                  ... on DatoCmsListSignalGroup {
                    id
                    slug
                    model {
                      apiKey
                    }
                  }
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
            colorVariant
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
