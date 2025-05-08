import React, { useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import backBtnIcon from '../components/Icons/back-btn.svg';
import Link from '../components/Global/Link/link';
import { ReactSVG } from 'react-svg';
import { detectService, formatDate, formatDateCSL } from '../utils';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import Form from '../components/Global/Form/form';
import axios from 'axios';
import Spinner from '../components/Global/Spinner/spinner';
import { CSLEventTemplate } from '../types';

import './basic.styles.scss';

type PageContextType = {
  heroImage?: { url: string };
};

type EventPageProps = PageProps<CSLEventTemplate, PageContextType>;

const CSLEvent: React.FC<EventPageProps> = ({ pageContext, data: { page, listEvent, favicon } }) => {
  const {
    title,
    slug,
    image_url,
    additional_image_sizes_url,
    description,
    rich_description,
    start_in_zone,
    end_in_zone,
    location,
    inputs = [],
    hiddenAddress = false,
    web_conference_url,
    waiting_list_enabled,
    max_attendees_count,
  } = page;

  const heroImage = pageContext?.heroImage?.url || image_url;
  const [shareWpText, setShareWpText] = useState<string>('');
  const [isWaitingListActive, setIsWaitingListActive] = useState<boolean>(false);
  const [status, setStatus] = useState<'loading' | 'idle'>('loading');

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

      console.log({ slug, max_attendees_count, isWaitingListActive, attendeesCount });
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
  const mainImage = additional_image_sizes_url?.find((i) => i.style === 'original') ?? null;

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

      <WrapperLayout variant="white">
        <HeroBasic image={{ url: heroImage }} overlay={false} external />

        <FloatLayout reduceOverlap>
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

          {status === 'idle' && formattedTitle && <h1 className="main-heading">{formattedTitle}</h1>}

          <div className={`form-wrapper`}>
            {status === 'loading' ? (
              <div className="spinner-wrapper">
                <Spinner />
              </div>
            ) : (
              <Form
                event={slug}
                inputs={inputs}
                conferenceUrl={web_conference_url}
                isWaitingList={isWaitingListActive}
              />
            )}
          </div>

          <div className="brief-information">
            <div className="metadata">
              {start_in_zone && (
                <span>
                  <img src={dateIcon} alt="Date icon" />
                  <span>{formatDate(start_in_zone)}</span>
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

              {!hiddenAddress && location?.venue && (
                <span>
                  <img src={locationIcon} alt="Location icon" />
                  <span>{location.venue}</span>
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

          {mainImage?.url && (
            <div className="image-event">
              <img src={mainImage.url} alt={title} />
            </div>
          )}

          {rich_description && (
            <div className="content" style={{ whiteSpace: 'break-spaces' }}>
              <p dangerouslySetInnerHTML={{ __html: rich_description }} />
            </div>
          )}
        </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default CSLEvent;

export const PageQuery = graphql`
  query CslEventById($id: String, $language: String!) {
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
    }
  }
`;
