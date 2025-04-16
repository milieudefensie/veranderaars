import React from 'react';
import { EventType } from '../../../types';
import EventCollectionCard from '../../Global/event-collection-card/event-collection-card';
import EventCardV2 from '../../Global/event-card-v2/event-card-v2';
import Map from '../../Global/Map/Map';
import {
  getEventsToday,
  getEventsTomorrow,
  getEventsDayAfterTomorrow,
  getEventsRestOfWeek,
  getEventsNextWeek,
  getEventsRestOfMonth,
} from '../../../utils';

import './styles.scss';

type Props = {
  events: EventType[];
  highlighEvent?: EventType;
};

const EventLayout: React.FC<Props> = ({ events = [], highlighEvent }) => {
  const today = getEventsToday(events);
  const tomorrowEvents = getEventsTomorrow(events);
  const dayAfterTomorrowEvents = getEventsDayAfterTomorrow(events);
  const restOfWeekEvents = getEventsRestOfWeek(events);
  const nextWeekEvents = getEventsNextWeek(events);
  const restOfMonthEvents = getEventsRestOfMonth(events);

  return (
    <div className="ui-event-layout">
      <header>
        <div className="container">
          <h1>Evenementen</h1>
          <p>Aankomende trainingen, acties, meetups en gezellige bijeenkomsten</p>
        </div>
      </header>

      <div className="container negative-margin">
        <div className="featured-collection">
          <EventCollectionCard collection={{}} />
        </div>

        <div className="map-container">
          <Map data={events} />
          <div className="alert-container">
            {/* <HelpIcon /> */}
            <span>
              Bekijk ook wat <strong>lokale groepen</strong> bij jou in de buurt doen, of{' '}
              <strong>organiseer zelf een evenement</strong>.
            </span>
          </div>
        </div>

        <div>
          <h3 className="heading">Uitgelichte evenementen</h3>
          <div className="grid-events two">
            <EventCollectionCard collection={{}} vertical />
            <EventCollectionCard collection={{}} vertical />
          </div>
        </div>
        <div>
          <h3 className="heading">Vandaag</h3>
          <div className="grid-events">
            {today.map((e) => (
              <EventCardV2 key={e.id} event={e} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">Morgen</h3>
          <div className="grid-events three">
            {tomorrowEvents.map((e) => (
              <EventCardV2 key={e.id} event={e} vertical />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">Woensdag</h3>
          <div className="grid-events">
            {dayAfterTomorrowEvents.map((e) => (
              <EventCardV2 key={e.id} event={e} vertical />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">Dit weekend</h3>
          <div className="grid-events two">
            {restOfWeekEvents.map((e) => (
              <EventCardV2 key={e.id} event={e} vertical />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">Komende week</h3>
          <div className="grid-events three">
            {nextWeekEvents.map((e) => (
              <EventCardV2 key={e.id} event={e} vertical />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">Later deze maand</h3>
          <div className="grid-events">
            {restOfMonthEvents.map((e) => (
              <EventCardV2 key={e.id} event={e} vertical />
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading">April</h3>
          <div className="grid-events">
            <EventCardV2 />
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default EventLayout;
