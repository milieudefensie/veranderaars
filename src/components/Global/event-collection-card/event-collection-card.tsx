import React from 'react';
import { EventCollectionType } from '../../../types';
import EventCardV2 from '../event-card-v2/event-card-v2';

import './styles.scss';

type Props = {
  collection: EventCollectionType;
  vertical?: boolean;
};

const EventCollectionCard: React.FC<Props> = ({ collection, vertical = false }) => {
  const { title, subtitle, description, ctas } = collection || {};

  return (
    <div className={`ui-event-collection-card ${vertical ? 'vertical-layout' : ''} transition-transform`}>
      {/* @ts-ignore */}
      <EventCardV2 event={{}} vertical={vertical} />
      <div className="related-events">
        <ul>
          {[1, 2, 3].map((_) => (
            <a href="" className="transition-all">
              <li>
                <div className="icon">
                  <CalendarIcon />
                </div>
                <div className="metadata">
                  <div className="date">Morgen 20:00</div>
                  <div className="type">Online</div>
                  <div className="intro">Intro-avond</div>
                </div>
              </li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
    <path
      fill="currentColor"
      d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z"
    ></path>
  </svg>
);

export default EventCollectionCard;
