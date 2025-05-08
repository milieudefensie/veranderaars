import React, { useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import { ReactSVG } from 'react-svg';
import Link from '../components/Global/Link/link';
import backBtnIcon from '../components/Icons/back-btn.svg';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import TagList from '../components/Global/Tag/tag-list';
import { formatDate } from '../utils';
import { EventTemplate } from '../types';

import './basic.styles.scss';

const Event: React.FC<PageProps<EventTemplate>> = ({ pageContext, data: { page, listEvent, favicon } }) => {
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
    shareMessage,
    image,
    content,
    tags = [],
  } = page;

  const [shareWpText, setShareWpText] = useState('');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

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
                <Link to={listEvent.slug}>
                  <img src={backBtnIcon} alt="Back button icon" />
                  <span>Alle evenementen</span>
                </Link>
              </div>

              {Array.isArray(tags) && <TagList tags={tags} />}
            </div>
          )}

          {title && <h1 className="main-heading">{title}</h1>}

          {/* Form */}
          {registrationForm && (
            <div className={`form-wrapper ${formBackgroundColor}`}>
              <HubspotForm {...registrationForm} style={formBackgroundColor === 'dark-green' ? '' : 'event'} />
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
                    {hourStart} {hourEnd ? ` - ${hourEnd}` : ''}
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
                <ReactSVG src={wpIcon} />
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
  query EventById($id: String, $language: String!) {
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
        gatsbyImageData
        url
      }
      content {
        value
        blocks {
          __typename
          ...BlockEmbedIframe
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
