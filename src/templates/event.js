import React from 'react';
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

import './event.styles.scss';

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
    image,
    content,
    tags = [],
    showDarkOverlay,
    reduceOverlap,
  } = page;

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic image={image} overlay={showDarkOverlay} />

        <FloatLayout reduceOverlap={reduceOverlap}>
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

            {whatsappGroup && (
              <a className="wp-button" href={`${whatsappGroup}`} target="_blank" rel="noopener noreferrer">
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
      showDarkOverlay
      reduceOverlap
      date
      hourStart
      hourEnd
      address
      region
      whatsappGroup
      registrationForm {
        ... on DatoCmsHubspot {
          formId
          region
          portalId
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
