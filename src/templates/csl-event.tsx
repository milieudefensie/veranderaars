import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout'; // @ts-expect-error
import { cleanLocation, detectService, formatDate, formatDateCSL, formatDateWithTimeCSL } from '../utils';
import Form from '../components/Global/Form/form';
import EventCardV2 from '../components/Global/event-card-v2/event-card-v2';
import { EventType } from '../types';
import { useCSLAttendees } from '../hooks/useCSLAttendees';
import Spinner from '../components/Global/Spinner/spinner';
import SignalModal from '../components/Global/SignalModal/signal-modal';

import './basic.styles.scss';
import './event.styles.scss';

// @ts-expect-error
const CSLEvent = ({ pageContext, data: { page, relatedEvents, collections, configuration, favicon } }) => {
  const {
    title,
    slug,
    image_url,
    additional_image_sizes_url,
    description,
    rich_description,
    raw_start,
    start_in_zone,
    location,
    inputs = [],
    hiddenAddress = false,
    web_conference_url,
    waiting_list_enabled,
    max_attendees_count,
  } = page;

  const [shareWpText, setShareWpText] = useState('');
  const [shareSignalMessage, setShareSignalMessage] = useState('');
  const [showSignalPopup, setShowSignalPopup] = useState(false);
  const [isWaitingListActive, setIsWaitingListActive] = useState(false);
  const { data, loading, error, fetchAttendees } = useCSLAttendees();

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    const currentURL = `${window.location.origin}/lokaal/${slug}?utm_medium=social&utm_source=whatsapp`;
    const signalURL = `${window.location.origin}/lokaal/${slug}?utm_medium=social&utm_source=signal`;

    const eventDateTime = `${formatDate(raw_start, true)} ${formatDateCSL(start_in_zone)}`;
    const eventLocation = location?.query ? cleanLocation(location.query) : '';

    const message = `Ik ga naar dit evenement: ${currentURL},
      Titel: ${formattedTitle},
      Datum: ${eventDateTime},
      ${eventLocation !== '' ? `Locatie: ${eventLocation}` : ''}
      Lijkt het je leuk om hier samen met mij heen te gaan?
    `;
    setShareWpText(`https://wa.me/?text=${encodeURIComponent(message)}`);

    const signalMessage = `Ik ga naar dit evenement: ${signalURL}

Titel: ${formattedTitle}
Datum: ${eventDateTime}
${eventLocation !== '' ? `Locatie: ${eventLocation}` : ''}

Lijkt het je leuk om hier samen met mij heen te gaan?`;

    setShareSignalMessage(signalMessage);
    fetchAttendees({ slug: slug, maxAttendeesCount: max_attendees_count });
  }, [slug, max_attendees_count]);

  const conferenceType = detectService(web_conference_url);
  const isConferenceWp = conferenceType === 'WhatsApp';
  const formattedTitle = data?.isWaitingListActive && !title.includes('[VOL]') ? `[VOL] ${title}` : title;
  let mainImage = Array.isArray(additional_image_sizes_url)
    ? additional_image_sizes_url.find((i) => i.style === 'original')?.url
    : null;

  const findParentCollection = (event: EventType) => {
    const parentCollection = collections.nodes.find((collection: any) => {
      const hasRelatedEvent = collection.relatedEvents?.some((e: any) => e.slug === event.slug);
      const matchesCalendarSlug = collection.cslCalendarSlug && event.calendar?.slug === collection.cslCalendarSlug;
      return hasRelatedEvent || matchesCalendarSlug;
    });

    return parentCollection;
  };

  const isLocalGroupOrganizer = (event: EventType) => {
    return configuration?.cslLocalGroupsSlugs.includes(event.calendar?.slug!);
  };

  const handleSignalShare = async () => {
    try {
      await navigator.clipboard.writeText(shareSignalMessage);
      setShowSignalPopup(true);
    } catch (err) {
      console.error('No se pudo copiar el mensaje al portapapeles', err);
    }
  };

  const collection = findParentCollection(page);
  const groupOrganizer = isLocalGroupOrganizer(page);

  if (loading) {
    return (
      <div className="full-screen-loader">
        <Spinner />
      </div>
    );
  }

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
        <div className="container">
          <header className="event-header">
            <div className="image-container">
              <picture>
                <img
                  src={mainImage || 'https://www.datocms-assets.com/115430/1712234204-pattern-2500.png'}
                  alt={`Image for ${formattedTitle}`}
                />
              </picture>
            </div>
            <div className="event-metadata">
              <div className="date-container">
                <span className="date">
                  <span>{formatDateWithTimeCSL(raw_start, start_in_zone)}</span>
                </span>
                {collection && (
                  <div>
                    <span className="badge-tour">{collection.title}</span>
                  </div>
                )}
              </div>
              <h1>{formattedTitle}</h1>
              <div className="location-container">
                {!hiddenAddress && location && <h3>{cleanLocation(location.query)}</h3>}
                {groupOrganizer && <div className="badge">Door lokale groep</div>}
              </div>

              {/* @ts-ignore */}
              <Form
                event={slug}
                inputs={inputs}
                conferenceUrl={web_conference_url}
                isWaitingList={isWaitingListActive}
                configuration={configuration}
                noStyle
              />
            </div>
          </header>
          <div className="event-participation">
            <div>
              <span className="badge-participation">{data?.attendeesCount} aanmeldingen</span>
            </div>
            <div className="btns-wrapper">
              <button className="btn-signal" onClick={handleSignalShare}>
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path fill="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"></path>
                </svg>
                Deel op Signal
              </button>
              <a href={shareWpText} rel="noopener noreferrer" target="_blank" className="btn-signal">
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path
                    fill="currentColor"
                    d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                  ></path>
                </svg>
                Deel op WhatsApp
              </a>
              <a href="#travel-together" className="btn-signal fill">
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path
                    fill="currentColor"
                    d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17m3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5"
                  ></path>
                </svg>
                Reis samen vanuit Utrecht
              </a>
            </div>
          </div>
          <div className="event-content">
            <div dangerouslySetInnerHTML={{ __html: rich_description }} />
          </div>

          {relatedEvents.nodes.length > 0 && (
            <div className="related-events-container">
              {relatedEvents.nodes.map((event: EventType) => (
                <EventCardV2
                  key={event.id}
                  event={event}
                  vertical
                  collection={findParentCollection(event)}
                  isLocalGroup={isLocalGroupOrganizer(event)}
                  extraClassName="tablet-responsive"
                />
              ))}
            </div>
          )}
        </div>

        <SignalModal
          isOpen={showSignalPopup}
          onClose={() => setShowSignalPopup(false)}
          defaultMessage={shareSignalMessage}
        />
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
      ...CSLEventPage
    }
    relatedEvents: allExternalEvent(filter: { cancelled_at: { eq: null }, id: { ne: $id } }, limit: 3) {
      nodes {
        ...CSLEventCard
      }
    }
    collections: allDatoCmsEventCollection {
      nodes {
        ...EventCollectionCard
      }
    }
    configuration: datoCmsSiteConfiguration {
      cslLocalGroupsSlugs
    }
  }
`;
