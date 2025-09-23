import React, { useEffect, useState } from 'react';
import MapWrapper from '../../Global/Map/map';
import { graphql, useStaticQuery } from 'gatsby'; // @ts-expect-error
import { mapCmsEvents, mapCslEvents } from '../../../utils';
import ListPaginated from '../../Global/Pagination/list-paginated'; // @ts-expect-error
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
      cslEvents: allExternalEvent(filter: { cancelled_at: { eq: null } }) {
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
      const navbar = document.querySelector('.navbar2') as HTMLElement;
      setMobileDevice(window.innerWidth < 992);

      if (mobileShowMap && window.innerWidth < 992) {
        htmlElement.style.overflow = 'hidden';
        navbar.style.backgroundColor = 'var(--nb-bg-light)';
        navbar.style.height = '85px';
      } else {
        htmlElement.style.overflow = '';
        navbar.style.backgroundColor = 'transparent';
        navbar.style.height = 'auto';
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
          <ListPaginated
            list={mapEvents}
            customPageSize={10}
            renderItem={(item: EventType) => (
              <EventCardV2
                key={item.id}
                event={item}
                lessInfo
                vertical={mapEvents.length > 1}
                collection={findParentCollection(item)}
                isLocalGroup={isLocalGroupOrganizer(item)}
              />
            )}
            extraLogic={() => {
              const targetElement = document.getElementById('filter-events-list');

              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MapFilter;
