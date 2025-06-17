import React from 'react';
import { EventType, EventCollectionType, CategorizedEvents } from '../../../types';
import EventCollectionCard from '../../Global/event-collection-card/event-collection-card';
import EventCardV2 from '../../Global/event-card-v2/event-card-v2';
import Map from '../../Global/Map/Map';
import {
  getEventsToday,
  getEventsTomorrow,
  getEventsDayAfterTomorrow,
  getEventsNextWeek,
  getEventsRestOfMonth,
  dummyEvents,
  getWeekendEvents,
  getEventsWeekDays,
  getDayAfterTomorrowLabel,
  getEventsGroupedByFutureMonths,
  capitalizeFirstLetter,
} from '../../../utils';
import { DateTime } from 'luxon';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

type Props = {
  events: EventType[];
  featuredCollection?: EventCollectionType;
  extraCollection?: EventCollectionType[];
};

const EventLayout: React.FC<Props> = ({ events = [], featuredCollection, extraCollection }) => {
  const { t } = useTranslate();
  const allEvents: EventType[] = [...events, ...dummyEvents];

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
        categorized.weekdays = getEventsWeekDays(allEvents, 3, 3); // Friday
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
        categorized.tomorrow = [];
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
            <EventCollectionCard
              collection={featuredCollection}
              calendarEvents={
                featuredCollection?.cslCalendarSlug
                  ? allEvents.filter((event) => {
                      return event.calendar?.slug === featuredCollection?.cslCalendarSlug;
                    })
                  : []
              }
            />
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
        {extraCollection && extraCollection.length > 0 && (
          <div>
            <h3 className="heading">{t('featured_events')}</h3>

            <div className={`event-collection grid-events ${extraCollection.length > 1 ? 'two' : 'one'}`}>
              {extraCollection?.map((c) => (
                <EventCollectionCard
                  collection={c}
                  vertical={extraCollection.length > 1}
                  calendarEvents={
                    c.cslCalendarSlug ? allEvents.filter((event) => event.calendar?.slug === c.cslCalendarSlug) : []
                  }
                />
              ))}
            </div>
          </div>
        )}
        {categorizedEvents.today.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('today'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.today.length === 1 ? 'one' : categorizedEvents.today.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.today.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.today.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.today.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.tomorrow.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('tomorrow'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.tomorrow.length === 1 ? 'one' : categorizedEvents.tomorrow.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.tomorrow.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.tomorrow.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.tomorrow.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.dayAfterTomorrow.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(getDayAfterTomorrowLabel())}</h3>
            <div
              className={`grid-events ${categorizedEvents.dayAfterTomorrow.length === 1 ? 'one' : categorizedEvents.dayAfterTomorrow.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.dayAfterTomorrow.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.dayAfterTomorrow.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.dayAfterTomorrow.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.weekdays.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('weekdays'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.weekdays.length === 1 ? 'one' : categorizedEvents.weekdays.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.weekdays.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.weekdays.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.weekdays.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.weekend.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('weekend'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.weekend.length === 1 ? 'one' : categorizedEvents.weekend.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.weekend.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.weekend.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.weekend.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.nextWeek.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('next_week'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.nextWeek.length === 1 ? 'one' : categorizedEvents.nextWeek.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.nextWeek.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.nextWeek.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.nextWeek.length > 1} />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.restOfMonth.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('rest_of_month'))}</h3>
            <div
              className={`grid-events ${events.length === 1 ? 'one' : categorizedEvents.restOfMonth.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.restOfMonth.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.restOfMonth.map((e) => (
                <EventCardV2 key={e.id} event={e} lessInfo vertical={categorizedEvents.restOfMonth.length > 1} />
              ))}
            </div>
          </>
        )}
        {Object.entries(futureEvents as Record<string, EventType[]>).map(([monthKey, events]) => {
          const monthLabel = DateTime.fromFormat(monthKey, 'yyyy-MM').setLocale('nl').toFormat('LLLL'); // e.g. "Mei", "Juni"

          return (
            <div key={monthKey}>
              <h3 className="heading">{capitalizeFirstLetter(monthLabel)}</h3>
              <div
                className={`grid-events ${events.length === 1 ? 'one' : events.length === 2 ? 'two' : 'three'} ${events.length === 2 ? 'mobile-two' : ''}`}
              >
                {events.map((e) => (
                  <EventCardV2 key={e.id} event={e} lessInfo vertical={events.length > 1} />
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
