import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import backBtnIcon from '../components/Icons/back-btn.svg';
import Link from '../components/Global/Link/link';
import { ReactSVG } from 'react-svg';
import { cleanLocation, detectService, formatDate, formatDateCSL } from '../utils';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import Form from '../components/Global/Form/Form';
import axios from 'axios';

import './basic.styles.scss';

const CSLEvent = ({ pageContext, data: { page, listEvent, configuration, favicon } }) => {
  const {
    title,
    slug,
    image_url,
    additional_image_sizes_url,
    description,
    rich_description,
    raw_start,
    raw_end,
    start_in_zone,
    end_in_zone,
    location,
    inputs = [],
    hiddenAddress = false,
    web_conference_url,
    waiting_list_enabled,
    max_attendees_count,
  } = page;

  const heroImage = image_url || pageContext?.heroImage?.url;
  const [shareWpText, setShareWpText] = useState('');
  const [isWaitingListActive, setIsWaitingListActive] = useState(false);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    const currentURL = encodeURIComponent(window.location.href);
    setShareWpText(`https://wa.me/?text=${currentURL}`);

    const checkIfEventHasReachedLimit = async () => {
      const response = await axios.post('/api/get-csl-attendees', {
        data: { slug, max_attendees_count },
      });
      const { isWaitingListActive, attendeesCount } = response.data;

      setIsWaitingListActive(isWaitingListActive);
      setStatus('idle');
    };

    if (max_attendees_count) {
      checkIfEventHasReachedLimit();
    } else {
      setStatus('idle');
    }
  }, [slug, max_attendees_count]);

  const conferenceType = detectService(web_conference_url);
  const isConferenceWp = conferenceType === 'WhatsApp';
  const formattedTitle = isWaitingListActive && !title.includes('[VOL]') ? `[VOL] ${title}` : title;
  let mainImage = Array.isArray(additional_image_sizes_url)
    ? additional_image_sizes_url.find((i) => i.style === 'original')?.url
    : null;

  return (
    <Layout>
      <SeoDatoCMS favicon={favicon}>
        <title>{formattedTitle}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={formattedTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image_url || ''} />
        <meta property="og:site_name" content="Milieudefensie" />

        <meta name="twitter:title" content={formattedTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image_url || ''} />
        <meta name="twitter:card" content="summary_large_image" />
      </SeoDatoCMS>

      <WrapperLayout variant="white event-detail">
        <div className={`form-wrapper`}>
          <Form
            title={title}
            event={slug}
            inputs={inputs}
            image={mainImage ?? heroImage}
            conferenceUrl={web_conference_url}
            isWaitingList={isWaitingListActive}
            configuration={configuration}
            introduction={
              <div className="event-introduction">
                <span className="date">
                  <img src={dateIcon} alt="Date icon" />
                  {formatDate(raw_start, true)} {formatDateCSL(start_in_zone)}{' '}
                  {raw_end ? `- ${formatDateCSL(end_in_zone)}` : ''}
                </span>
                {location?.query && (
                  <span className="date">
                    <img src={locationIcon} alt="Location icon" />
                    {cleanLocation(location.query)}
                  </span>
                )}
              </div>
            }
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
                  </div>
                )}
              </>
            }
          />
        </div>

        <FloatLayout reduceOverlap>
          {mainImage?.url && (
            <div className="image-event">
              <img src={mainImage.url} alt={title} />
            </div>
          )}

          {rich_description && (
            <div className="content csl-variant" style={{ whiteSpace: 'break-spaces' }}>
              <p dangerouslySetInnerHTML={{ __html: rich_description }} />
            </div>
          )}

          <div className="brief-information">
            <div className="metadata">
              {raw_start && (
                <span>
                  <img src={dateIcon} alt="Date icon" />
                  <span>{formatDate(raw_start, true)}</span>
                </span>
              )}

              {start_in_zone && (
                <span>
                  <img src={hourIcon} alt="Hour icon" />
                  <span>
                    {formatDateCSL(start_in_zone)}
                    {end_in_zone ? ` - ${formatDateCSL(end_in_zone)}` : ''}
                  </span>
                </span>
              )}

              {!hiddenAddress && location?.query && (
                <span>
                  <img src={locationIcon} alt="Location icon" />
                  <span>{cleanLocation(location.query)}</span>
                </span>
              )}
            </div>

            {!isConferenceWp && shareWpText && (
              <a className="wp-button" href={shareWpText} target="_blank" rel="noopener noreferrer">
                <span>Deel op WhatsApp</span>
                <ReactSVG src={wpIcon} />
              </a>
            )}
          </div>
        </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default CSLEvent;

export const PageQuery = graphql`
  query CslEventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
    configuration: datoCmsSiteConfiguration {
      formFirstStepDisclaimer
      formSecondStepTitle
      formSecondStepDescription
      formSecondStepDisclaimer
    }
    page: externalEvent(id: { eq: $id }) {
      __typename
      id
      slug
      title
      url
      description
      rich_description
      raw_start
      raw_end
      start_at
      end_at
      start_in_zone
      end_in_zone
      time_zone
      virtual
      launched_at
      locale
      image_url
      hiddenAddress
      location {
        latitude
        longitude
        postal_code
        country
        region
        locality
        query
        street
        street_number
        venue
      }
      labels
      inputs
      web_conference_url
      max_attendees_count
      waiting_list_enabled
      additional_image_sizes_url {
        url
        style
      }
    }
  }
`;
