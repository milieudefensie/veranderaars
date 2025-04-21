import React from 'react';
import { EventType, EventCollectionType } from '../../../types';
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
  dummyEvents,
  getWeekendEvents,
  getEventsWeekDays,
  getDayAfterTomorrowLabel,
  getEventsGroupedByFutureMonths,
} from '../../../utils';
import { DateTime } from 'luxon';

import './styles.scss';

type Props = {
  events: EventType[];
  featuredCollection?: EventCollectionType;
  extraCollection?: EventCollectionType[];
};

type CategorizedEvents = {
  today: EventType[];
  tomorrow: EventType[];
  dayAfterTomorrow: EventType[];
  weekdays: EventType[]; // resto de la semana laboral
  weekend: EventType[];
  nextWeek: EventType[];
  restOfMonth: EventType[];
};

const EventLayout: React.FC<Props> = ({ events = [], featuredCollection, extraCollection }) => {
  const allEvents = [...events, ...dummyEvents];

  const categorizedEvents = setEventCategories();
  const futureEvents = getEventsGroupedByFutureMonths(allEvents);

  function setEventCategories() {
    const currentDay = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    const categorized: CategorizedEvents = {
      today: getEventsToday(allEvents),
      tomorrow: getEventsTomorrow(allEvents),
      dayAfterTomorrow: getEventsDayAfterTomorrow(allEvents),
      weekdays: [],
      weekend: [],
      nextWeek: [],
      restOfMonth: getEventsRestOfMonth(allEvents),
    };

    switch (currentDay) {
      case 1: // Monday
        categorized.weekdays = getEventsWeekDays(allEvents, 2, 4); // Wed-Fri
        categorized.weekend = getWeekendEvents(allEvents);
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 2: // Tuesday
        categorized.weekdays = getEventsWeekDays(allEvents, 2, 3); // Thu-Fri
        categorized.weekend = getWeekendEvents(allEvents);
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 3: // Wednesday
        categorized.weekdays = getEventsWeekDays(allEvents, 2, 2); // Friday
        categorized.weekend = getWeekendEvents(allEvents);
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 4: // Thursday
        categorized.weekend = getWeekendEvents(allEvents);
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 5: // Friday
        categorized.weekend = getWeekendEvents(allEvents);
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 6: // Saturday
        categorized.tomorrow = getEventsTomorrow(allEvents); // Sunday
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
      case 0: // Sunday
        categorized.nextWeek = getEventsNextWeek(allEvents);
        break;
    }

    return categorized;
  }

  return (
    <div className="ui-event-layout">
      <header>
        <div className="container">
          <h1>Evenementen</h1>
          <p>Aankomende trainingen, acties, meetups en gezellige bijeenkomsten</p>
        </div>
      </header>

      <div className="container negative-margin">
        {featuredCollection && (
          <div className="featured-collection">
            <EventCollectionCard collection={featuredCollection} />
          </div>
        )}
        <div className="map-container">
          <Map data={events} />
          <div className="alert-container">
            <HelpIcon />
            <span>
              Bekijk ook wat <strong>lokale groepen</strong> bij jou in de buurt doen, of{' '}
              <strong>organiseer zelf een evenement</strong>.
            </span>
          </div>
        </div>
        <div>
          <h3 className="heading">Uitgelichte evenementen</h3>
          <div className="grid-events two">
            {extraCollection?.map((c) => <EventCollectionCard collection={c} vertical />)}
          </div>
        </div>
        {categorizedEvents.today.length > 0 && (
          <>
            <h3 className="heading">Vandaag</h3>
            <div className={`grid-events ${categorizedEvents.today.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.today.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.tomorrow.length > 0 && (
          <>
            <h3 className="heading">Morgen</h3>
            <div className={`grid-events ${categorizedEvents.tomorrow.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.tomorrow.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.dayAfterTomorrow.length > 0 && (
          <>
            <h3 className="heading">{getDayAfterTomorrowLabel()}</h3>
            <div className={`grid-events ${categorizedEvents.dayAfterTomorrow.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.dayAfterTomorrow.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.weekdays.length > 0 && (
          <>
            <h3 className="heading">Weekdagen</h3>
            <div className={`grid-events ${categorizedEvents.weekdays.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.weekdays.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.weekend.length > 0 && (
          <>
            <h3 className="heading">Dit weekend</h3>
            <div className={`grid-events ${categorizedEvents.weekend.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.weekend.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.nextWeek.length > 0 && (
          <>
            <h3 className="heading">Komende week</h3>
            <div className={`grid-events ${categorizedEvents.nextWeek.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.nextWeek.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.restOfMonth.length > 0 && (
          <>
            <h3 className="heading">Later deze maand</h3>
            <div className={`grid-events ${categorizedEvents.restOfMonth.length % 2 === 0 ? 'two' : 'three'}`}>
              {categorizedEvents.restOfMonth.map((e) => (
                <EventCardV2 key={e.id} event={e} vertical lessInfo />
              ))}
            </div>
          </>
        )}

        {Object.entries(futureEvents).map(([monthKey, events]) => {
          const monthLabel = DateTime.fromFormat(monthKey, 'yyyy-MM').setLocale('nl').toFormat('LLLL'); // e.g. "Mei", "Juni"

          return (
            <div key={monthKey}>
              <h3 className="heading">{monthLabel}</h3>
              <div className={`grid-events ${events.length % 2 === 0 ? 'two' : 'three'}`}>
                {events.map((e: EventType) => (
                  <EventCardV2 key={e.id} event={e} vertical lessInfo />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    style={{
      stroke: 'oklch(58.2% .2226 304.59)',
      height: '1.2rem',
      width: '1.2rem',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default EventLayout;
