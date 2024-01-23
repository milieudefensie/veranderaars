import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import SeoDatoCMS from '../../components/Layout/SeoDatocms';
import WrapperLayout from '../../components/Layout/WrapperLayout/WrapperLayout';
import HeroBasic from '../../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../../components/Global/FloatLayout/FloatLayout';
import { graphql } from 'gatsby';
import axios from 'axios';
import Link from '../../components/Global/Link/Link';
import backBtnIcon from '../../components/Icons/back-btn.svg';
import dateIcon from '../../components/Icons/calendar-date.svg';
import hourIcon from '../../components/Icons/calendar-hour.svg';
import locationIcon from '../../components/Icons/calendar-location.svg';
import { convertTime, formatDate } from '../../utils';
import Spinner from '../../components/Global/Spinner/Spinner';
import Cta from '../../components/Global/Cta/Cta';

import '../../templates/event.styles.scss';

const CSLEventPage = ({ data: { listEvent, favicon }, params }) => {
  const slug = params.slug;

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    async function fetchEvents() {
      setStatus('loading');

      try {
        const response = await axios.get('/api/events');
        const fetchedEvents = response.data.events[0].list;
        const eventBySlug = fetchedEvents.filter((e) => e.slug == slug)[0];

        if (eventBySlug) {
          setEvent(eventBySlug);
        }
        setStatus('success');
      } catch (error) {
        console.error('Error fetching event:', error);
        setStatus('error');
      }
    }

    fetchEvents();
  }, []);

  if (status === 'loading') {
    return (
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!event) return <></>;

  const { title = null, description, image_url, location, start_at, end_at, url } = event;

  return (
    <Layout>
      <SeoDatoCMS favicon={favicon}>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta name="description" content={title} />
        <meta property="og:description" content={title} />
        <meta name="twitter:description" content={title} />
      </SeoDatoCMS>

      <WrapperLayout variant="white">
        <HeroBasic image={{ url: image_url }} />

        <FloatLayout>
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

          {title && <h1>{title}</h1>}

          {/* Form */}
          <div className="external-register">
            <Cta externalTitle="Register" url={url} />
          </div>

          {/* Brief information */}
          <div className="brief-information">
            <div className="metadata">
              {start_at && (
                <span>
                  <img src={dateIcon} alt="Date icon" />
                  <span>{formatDate(start_at)}</span>
                </span>
              )}

              {start_at && (
                <span>
                  <img src={hourIcon} alt="Hour icon" />
                  <span>
                    {start_at ? convertTime(start_at) : ''} {end_at ? ` - ${convertTime(end_at)}` : ''}
                  </span>
                </span>
              )}

              {location?.query && (
                <span>
                  <img src={locationIcon} alt="Location icon" />
                  <span>{location.query}</span>
                </span>
              )}
            </div>
          </div>

          {description && (
            <div className="content">
              <p dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}
        </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default CSLEventPage;

export const CSLEventQuery = graphql`
  query CSLEventById {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
  }
`;
