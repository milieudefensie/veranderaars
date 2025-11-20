import React, { useEffect, useState } from 'react';
import MapWrapper from '../../Global/Map/map';
import { graphql, useStaticQuery } from 'gatsby'; // @ts-expect-error
import { mapCmsEvents, mapCslEvents } from '../../../utils'; // @ts-expect-error
import useCSLEvents from '../../../hooks/useCSLEvents';
import EventCardV2 from '../../Global/event-card-v2/event-card-v2';
import { EventType } from '../../../types';

import './styles.scss';

interface MapFilterProps {
  block: {
    filterBy?: { id?: string };
    labelsInCsl?: string;
    textOverlayingMap?: string;
    showMap: boolean;
    showList: boolean;
    buttonOnMap: boolean;
    cslCalendarName?: string;
    extraEvents?: string;
  };
}

const MapFilter: React.FC<MapFilterProps> = ({ block }) => {
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const {
    filterBy = {},
    labelsInCsl,
    textOverlayingMap,
    showMap,
    showList,
    buttonOnMap,
    cslCalendarName,
    extraEvents,
  } = block;

  const {
    allDatoCmsEvent: events,
    cslEvents,
    collections,
    configuration,
  } = useStaticQuery(graphql`
    query events {
      cslEvents: allExternalEvent(filter: { cancelled_at: { eq: null }, show_in_agenda_list: { eq: true } }) {
        edges {
          node {
            ...CSLEventCard
          }
        }
      }
      allDatoCmsEvent(filter: { closeEvent: { ne: true } }) {
        edges {
          node {
            id
            title
            slug
            externalLink
            introduction
            date
            rawDate: date
            hourStart
            hourEnd
            onlineEvent
            address
            region
            coordinates {
              latitude
              longitude
            }
            tags {
              ... on DatoCmsTag {
                id
                title
              }
            }
            image {
              url
              gatsbyImageData
            }
            model {
              apiKey
            }
          }
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
  `);

  const cmsEvents = mapCmsEvents(events);
  const cslEventsMapped = mapCslEvents(cslEvents);
  const { mergedEvents } = useCSLEvents(cmsEvents, cslEventsMapped);

  const filteredEvents = mergedEvents.filter((e: any) => {
    if (!labelsInCsl && !filterBy?.id && !cslCalendarName) return true;

    const isCSLEvent = e.type === 'CSL';
    if (isCSLEvent) {
      if (extraEvents && e.slug.includes(extraEvents)) {
        return true;
      }
      if (cslCalendarName) {
        return e.calendar?.slug === cslCalendarName;
      }

      return e.labels?.includes(labelsInCsl);
    }

    return e.tags?.some((t: any) => t.id === filterBy?.id);
  });

  useEffect(() => {
    const handleWindowResize = () => {
      const htmlElement = document.documentElement;
      const navbar = document.querySelector('#header-mobile-wrapper') as HTMLElement;
      setMobileDevice(window.innerWidth < 992);

      if (mobileShowMap && window.innerWidth < 992) {
        htmlElement.style.overflow = 'hidden';
        navbar.style.backgroundColor = 'var(--nb-bg-light)';
      } else {
        htmlElement.style.overflow = '';
        navbar.style.backgroundColor = 'transparent';
      }
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileShowMap]);

  const handleOnMobile = () => {
    if (mobileDevice) {
      setMobileShowMap(true);
    }
  };

  const findParentCollection = (event: EventType) => {
    const parentCollections = collections.nodes.filter((collection: any) => {
      const hasRelatedEvent = collection.relatedEvents?.some((e: any) => e.slug === event.slug);

      const matchesCalendarSlug = (() => {
        if (!collection.cslCalendarSlug || !event.calendar?.slug) return false;
        const slugs = collection.cslCalendarSlug.split(',').map((s: string) => s.trim());
        return slugs.includes(event.calendar.slug);
      })();

      return hasRelatedEvent || matchesCalendarSlug;
    });

    const uniqueCollections = parentCollections.filter(
      (col, index, self) => index === self.findIndex((c) => c.title === col.title)
    );

    return uniqueCollections;
  };

  const isLocalGroupOrganizer = (event: EventType) => {
    return configuration?.cslLocalGroupsSlugs.includes(event.calendar?.slug!);
  };

  const mapEvents = filteredEvents;

  return (
    <div className={`map-filter-block ${mobileShowMap ? 'mobile-show' : ''}`}>
      {showMap && (
        <MapWrapper
          type="event"
          title={textOverlayingMap}
          data={mapEvents}
          floatButton={buttonOnMap}
          mobileView={mobileShowMap}
          setMobileView={setMobileShowMap}
          extraLogic={handleOnMobile}
        />
      )}

      {showList && (
        <div
          id="filter-events-list"
          className={`grid-events ${mapEvents.length === 1 ? 'one' : mapEvents.length === 2 ? 'two' : 'three'} ${mapEvents.length === 2 ? 'mobile-two' : ''}`}
        >
          {mapEvents.map((item: EventType) => (
            <EventCardV2
              key={item.id}
              event={item}
              lessInfo
              vertical={mapEvents.length > 1}
              collection={findParentCollection(item)}
              isLocalGroup={isLocalGroupOrganizer(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapFilter;
