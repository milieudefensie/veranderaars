import React from 'react';
import { EventType, EventCollectionType, CategorizedEvents } from '../../../types';
import EventCollectionCard from '../../Global/event-collection-card/event-collection-card';
import EventCardV2 from '../../Global/event-card-v2/event-card-v2';
import Map from '../../Global/Map/map';
import {
  getEventsToday,
  getEventsTomorrow,
  getEventsDayAfterTomorrow,
  getEventsNextWeek,
  getEventsRestOfMonth,
  getWeekendEvents,
  getEventsWeekDays,
  getDayAfterTomorrowLabel,
  getEventsGroupedByFutureMonths,
  capitalizeFirstLetter, // @ts-expect-error
} from '../../../utils';
import { DateTime } from 'luxon';
import { useTranslate } from '@tolgee/react';
import { Link } from 'gatsby';

import './styles.scss';

type Props = {
  title: string;
  introduction: string;
  events: EventType[];
  featuredCollection?: EventCollectionType;
  extraCollection?: EventCollectionType[];
  allCollections: EventCollectionType[];
  highlightedEvent?: EventType;
  configuration?: {
    cslLocalGroupsSlugs: string;
  };
};

const EventLayout: React.FC<Props> = ({
  title,
  introduction,
  events = [],
  featuredCollection,
  extraCollection,
  allCollections,
  highlightedEvent,
  configuration,
}) => {
  const { t } = useTranslate();
  const allEvents: EventType[] = [...events];

  const futureEvents = getEventsGroupedByFutureMonths(allEvents);
  const shownEventIds = new Set<string>();

  const filterAndMark = (group: EventType[]) => {
    return group.filter((event) => {
      if (shownEventIds.has(event.id)) return false;
      shownEventIds.add(event.id);
      return true;
    });
  };

  const setEventCategories = () => {
    const currentDay = new Date().getDay();

    const categorized: CategorizedEvents = {
      today: filterAndMark(getEventsToday(allEvents)),
      tomorrow: filterAndMark(getEventsTomorrow(allEvents)),
      dayAfterTomorrow: filterAndMark(getEventsDayAfterTomorrow(allEvents)),
      weekdays: [],
      weekend: [],
      nextWeek: [],
      restOfMonth: [],
    };

    switch (currentDay) {
      case 1: // Monday
        categorized.weekdays = filterAndMark(getEventsWeekDays(allEvents, 2, 4)); // Wed–Fri
        categorized.weekend = filterAndMark(getWeekendEvents(allEvents));
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 2: // Tuesday
        categorized.weekdays = filterAndMark(getEventsWeekDays(allEvents, 2, 3)); // Thu–Fri
        categorized.weekend = filterAndMark(getWeekendEvents(allEvents));
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 3: // Wednesday
        categorized.weekdays = filterAndMark(getEventsWeekDays(allEvents, 3, 3)); // Friday
        categorized.weekend = filterAndMark(getWeekendEvents(allEvents));
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 4: // Thursday
        categorized.weekend = filterAndMark(getWeekendEvents(allEvents));
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 5: // Friday
        categorized.weekend = filterAndMark(getWeekendEvents(allEvents));
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 6: // Saturday
        categorized.tomorrow = filterAndMark(getEventsTomorrow(allEvents)); // Sunday
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
      case 0: // Sunday
        categorized.tomorrow = []; // vacío explícitamente
        categorized.nextWeek = filterAndMark(getEventsNextWeek(allEvents));
        break;
    }

    categorized.restOfMonth = filterAndMark(getEventsRestOfMonth(allEvents));

    return categorized;
  };

  const categorizedEvents = setEventCategories();

  const findParentCollection = (event: EventType) => {
    const parentCollections = allCollections.filter((collection) => {
      const hasRelatedEvent = collection.relatedEvents?.some((e) => e.slug === event.slug);

      const matchesCalendarSlug = (() => {
        if (!collection.cslCalendarSlug || !event.calendar?.slug) return false;
        const slugs = collection.cslCalendarSlug.split(',').map((s) => s.trim());
        return slugs.includes(event.calendar.slug);
      })();

      return hasRelatedEvent || matchesCalendarSlug;
    });

    return parentCollections;
  };

  const isLocalGroupOrganizer = (event: EventType) => {
    return configuration?.cslLocalGroupsSlugs.includes(event.calendar?.slug!);
  };

  function getCalendarEventsForCollection(
    collection: EventCollectionType | null | undefined,
    allEvents: EventType[] = []
  ): EventType[] {
    if (!collection?.cslCalendarSlug) return [];

    const slugs = collection.cslCalendarSlug
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) return [];

    const events = allEvents.filter((event) => slugs.includes(event.calendar?.slug!));

    return events;
  }

  return (
    <div className="ui-event-layout">
      <header>
        <div className="container">
          <h1>{title}</h1>
          <p>{introduction}</p>
        </div>
      </header>

      <div className="container negative-margin">
        {featuredCollection && (
          <div className="featured-collection">
            <EventCollectionCard
              collection={featuredCollection}
              calendarEvents={getCalendarEventsForCollection(featuredCollection, allEvents)}
            />
          </div>
        )}
        {highlightedEvent && (
          <div className="highlight-event-container">
            <EventCardV2 event={highlightedEvent} isLocalGroup={isLocalGroupOrganizer(highlightedEvent)} />
          </div>
        )}
        <div className="map-container">
          {/* @ts-ignore */}
          <Map data={events} />
          <div className="alert-container">
            <HelpIcon />
            <span>
              Bekijk ook wat{' '}
              <Link
                to="/groepen"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'bold',
                }}
              >
                lokale groepen
              </Link>{' '}
              bij jou in de buurt doen.
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
                  calendarEvents={getCalendarEventsForCollection(c, allEvents)}
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.today.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.tomorrow.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.dayAfterTomorrow.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.weekdays.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.weekend.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
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
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.nextWeek.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
              ))}
            </div>
          </>
        )}
        {categorizedEvents.restOfMonth.length > 0 && (
          <>
            <h3 className="heading">{capitalizeFirstLetter(t('rest_of_month'))}</h3>
            <div
              className={`grid-events ${categorizedEvents.restOfMonth.length === 1 ? 'one' : categorizedEvents.restOfMonth.length % 2 === 0 ? 'two' : 'three'} ${categorizedEvents.restOfMonth.length === 2 ? 'mobile-two' : ''}`}
            >
              {categorizedEvents.restOfMonth.map((e) => (
                <EventCardV2
                  key={e.id}
                  event={e}
                  lessInfo
                  vertical={categorizedEvents.restOfMonth.length > 1}
                  collection={findParentCollection(e)}
                  isLocalGroup={isLocalGroupOrganizer(e)}
                />
              ))}
            </div>
          </>
        )}
        {Object.entries(futureEvents).map(([monthKey, rawEvents]) => {
          const monthLabel = DateTime.fromFormat(monthKey, 'yyyy-MM').setLocale('nl').toFormat('LLLL');
          const eventsToRender = filterAndMark(rawEvents as EventType[]);

          return eventsToRender.length > 0 ? (
            <div key={monthKey}>
              <h3 className="heading">{capitalizeFirstLetter(monthLabel)}</h3>
              <div
                className={`grid-events ${eventsToRender.length === 1 ? 'one' : eventsToRender.length === 2 ? 'two' : 'three'} ${eventsToRender.length === 2 ? 'mobile-two' : ''}`}
              >
                {eventsToRender.map((e) => (
                  <EventCardV2
                    key={e.id}
                    event={e}
                    lessInfo
                    vertical={eventsToRender.length > 1}
                    collection={findParentCollection(e)}
                    isLocalGroup={isLocalGroupOrganizer(e)}
                  />
                ))}
              </div>
            </div>
          ) : null;
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
      stroke: 'rgb(154, 73, 226)',
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
