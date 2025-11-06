import React from 'react';
import { EventCollectionType, EventType } from '../../../types';
import EventCardV2 from '../event-card-v2/event-card-v2';
import Link from '../../Global/Link/link'; // @ts-expect-error
import { formatDateCSL, formatEventDate, getClosestEvents } from '../../../utils';

import './styles.scss';

type Props = {
  collection: EventCollectionType;
  vertical?: boolean;
  calendarEvents?: EventType[];
};

const EventCollectionCard: React.FC<Props> = ({ collection, vertical = false, calendarEvents }) => {
  const { id, title, subtitle, description, ctas, image, relatedEvents } = collection || {};
  const closestEvents = getClosestEvents(relatedEvents, calendarEvents);

  return (
    <div className={`ui-event-collection-card ${vertical ? 'vertical-layout' : ''} transition-transform`}>
      <EventCardV2
        event={{
          id: `card-${id}`,
          image,
          title,
          introduction: description,
          type: subtitle,
          __typename: 'EventCollection',
        }}
        vertical={vertical}
        cta={ctas?.length > 0 ? ctas![0] : null}
        isHighlighted
      />
      {closestEvents.length > 0 && (
        <div className={`related-events length-${closestEvents.length}`}>
          <ul>
            {closestEvents.map((e: EventType) => (
              <Link to={e} className="transition-all">
                <li>
                  <div className="icon">
                    <CalendarIcon />
                  </div>
                  <div className="metadata">
                    <div className="date">
                      {e.__typename === 'ExternalEvent' || e.type === 'CSL' ? (
                        <>
                          {formatEventDate(e.rawDate)} {formatDateCSL(e.startInZone)}
                        </>
                      ) : (
                        formatEventDate(e.date, e.hourStart)
                      )}
                    </div>
                    <div className="type">
                      {e.__typename === 'ExternalEvent' || e.type === 'CSL'
                        ? e.location?.street || 'Online'
                        : e.beknopteAddress
                          ? e.beknopteAddress
                          : e.address
                            ? e.address
                            : e.type}
                    </div>
                    <div className="intro">{e.title}</div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
    <path
      fill="currentColor"
      d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z"
    ></path>
  </svg>
);

export const GenericCollectionCard: React.FC<any> = ({
  collection,
  customLink,
  ctaTitle,
  ctaVariant,
  closestEvents,
  customImage,
  hideImageOnMobile = false,
}) => {
  const { title, subtitle, description, image } = collection || {};
  return (
    <div
      className={`ui-event-collection-card generic-variant transition-transform ${hideImageOnMobile ? 'hide-image-mobile' : ''}`}
    >
      <Link to={customLink || collection} target={customLink ? '_blank' : '_self'} className="ui-event-card-v2">
        <div className="image-container">{customImage ? customImage : <img src={image?.url} alt="Event" />}</div>
        <div className="content-container">
          <div>
            <h3>{title}</h3>
            <span className="subtitle">{subtitle}</span>
            <div className="introduction" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <span className={`custom-btn custom-btn-primary group-v2 big ${ctaVariant}`}>
            {ctaTitle || 'Meld je aan'}
          </span>
        </div>
      </Link>
      {Array.isArray(closestEvents) && closestEvents.length > 0 && (
        <div className={`related-events length-${closestEvents.length}`}>
          <ul>
            {closestEvents.map((e: EventType) => (
              <Link to={e} className="transition-all">
                <li>
                  <div className="icon">
                    <CalendarIcon />
                  </div>
                  <div className="metadata">
                    <div className="date">
                      {e.__typename === 'ExternalEvent' || e.type === 'CSL' ? (
                        <>
                          {formatEventDate(e.rawDate)} {formatDateCSL(e.startInZone)}
                        </>
                      ) : (
                        formatEventDate(e.date, e.hourStart)
                      )}
                    </div>
                    <div className="type">
                      {e.__typename === 'ExternalEvent' || e.type === 'CSL'
                        ? e.location?.street || 'Online'
                        : e.beknopteAddress
                          ? e.beknopteAddress
                          : e.address
                            ? e.address
                            : e.type}
                    </div>
                    <div className="intro">{e.title}</div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCollectionCard;
