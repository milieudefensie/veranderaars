import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import { ReactSVG } from 'react-svg';
import Link from '../components/Global/Link/link';
import backBtnIcon from '../components/Icons/back-btn.svg';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import TagList from '../components/Global/Tag/TagList';
import { formatDate, isArray } from '../utils';
import FormSteps from '../components/Global/FormSteps/FormSteps';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';

import './basic.styles.scss';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';

const Event = ({ pageContext, data: { page, listEvent, favicon } }) => {
  const {
    seo,
    title,
    introduction,
    hourStart,
    hourEnd,
    date,
    address,
    shareMessage,
    image,
    content,
    tags = [],
    formSteps,
    registrationForm,
    formBackgroundColor,
  } = page;

  const [shareWpText, setShareWpText] = useState('');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    // Share WP
    const currentURL = encodeURIComponent(window.location.href);
    setShareWpText(shareMessage ? `https://wa.me/?text=${shareMessage}` : `https://wa.me/?text=${currentURL}`);
  }, []);

  const withFormsSteps = isArray(formSteps);

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant={`white ${withFormsSteps ? 'event-detail' : ''}`}>
        {withFormsSteps ? (
          <FormSteps
            title={title}
            descriptionAsHtml
            description={
              <div className="event-introduction">
                <span className="date">
                  <img src={dateIcon} alt="Date icon" />
                  {formatDate(date, true)} {hourStart ? hourStart : ''} {hourEnd ? ` - ${hourEnd}` : ''}
                </span>
                {address && (
                  <span className="date">
                    <img src={locationIcon} alt="Location icon" />
                    {address}
                  </span>
                )}
              </div>
            }
            bgImageUrl={image?.url}
            form={formSteps}
            variant="green agenda"
            headerComponents={
              <>
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
              </>
            }
          />
        ) : (
          <HeroBasic image={image} overlay={false} />
        )}

        <FloatLayout reduceOverlap>
          {!withFormsSteps && (
            <>
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
              {title && <h1 className="main-heading">{title}</h1>}

              {/* Brief information */}
              <div className="brief-information">
                <div className="metadata">
                  {date && (
                    <span>
                      <img src={dateIcon} alt="Date icon" />
                      <span>{formatDate(date, true)}</span>
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

                {shareMessage && (
                  <a className="wp-button" href={shareWpText} target="_blank" rel="noopener noreferrer">
                    <span>Deel op WhatsApp</span>
                    <ReactSVG src={wpIcon} alt="Wp icon" />
                  </a>
                )}
              </div>
            </>
          )}

          {/* Form  */}
          {registrationForm && !isArray(formSteps) && (
            <div className={`form-wrapper ${formBackgroundColor}`}>
              <HubspotForm {...registrationForm} style={`${formBackgroundColor === 'dark-green' ? '' : 'event'}`} />
            </div>
          )}

          {introduction && <div className="introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}

          {content?.value && (
            <div className="content">
              <StructuredTextDefault content={content} />
            </div>
          )}

          {/* Brief information */}
          {withFormsSteps && (
            <div className="brief-information">
              <div className="metadata">
                {date && (
                  <span>
                    <img src={dateIcon} alt="Date icon" />
                    <span>{formatDate(date, true)}</span>
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

              {shareMessage && (
                <a className="wp-button" href={shareWpText} target="_blank" rel="noopener noreferrer">
                  <span>Deel op WhatsApp</span>
                  <ReactSVG src={wpIcon} alt="Wp icon" />
                </a>
              )}
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
      shareMessage
      formSteps {
        ...FormStepBlock
      }
      registrationForm {
        ... on DatoCmsHubspot {
          formId
          region
          portalId
          columns
          trackErrors
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
        url
      }
      content {
        value
        blocks {
          __typename
          ...BlockEmbedIframe
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
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
