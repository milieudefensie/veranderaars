import React, { useEffect, useState } from 'react';
import MapWrapper from '../../Global/Map/map';
import { graphql, useStaticQuery } from 'gatsby'; // @ts-expect-error
import { mapCmsEvents, mapCslEvents } from '../../../utils';
import ListPaginated from '../../Global/Pagination/list-paginated';
import EventCard from '../HighlightEvent/event-card'; // @ts-expect-error
import useCSLEvents from '../../../hooks/useCSLEvents';

import './styles.scss';

interface Location {
  latitude: number;
  longitude: number;
  venue?: string;
  query?: string;
  region?: string;
}

interface Calendar {
  name: string;
  slug: string;
}

interface CSLNode {
  id: string;
  slug: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  raw_start: string;
  raw_end: string;
  image_url: string;
  labels: string[];
  start_in_zone: string;
  end_in_zone: string;
  location: Location;
  calendar: Calendar;
  hiddenAddress?: string;
}

interface DatoCmsTag {
  id: string;
  title: string;
}

interface DatoCmsEvent {
  id: string;
  title: string;
  slug: string;
  externalLink?: string;
  introduction: string;
  date: string;
  rawDate: string;
  hourStart: string;
  hourEnd: string;
  onlineEvent: boolean;
  address: string;
  region: string;
  coordinates: Location;
  tags: DatoCmsTag[];
  image: {
    url: string;
    gatsbyImageData: any;
  };
  model: {
    apiKey: string;
  };
}

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

  const { allDatoCmsEvent: events, cslEvents } = useStaticQuery(graphql`
    query events {
      cslEvents: allExternalEvent(filter: { cancelled_at: { eq: null } }) {
        edges {
          node {
            id
            slug
            title
            description
            start_at
            end_at
            raw_start
            raw_end
            image_url
            labels
            start_in_zone
            end_in_zone
            location {
              latitude
              longitude
              venue
              query
              region
            }
            calendar {
              name
              slug
            }
            hiddenAddress
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
    }
  `);

  const cmsEvents = mapCmsEvents(events);
  const cslEventsMapped = mapCslEvents(cslEvents);
  const { mergedEvents } = useCSLEvents(cmsEvents, cslEventsMapped);

  const filteredEvents = mergedEvents.filter((e) => {
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

    return e.tags?.some((t) => t.id === filterBy?.id);
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

  return (
    <div className={`map-filter-block ${mobileShowMap ? 'mobile-show' : ''}`}>
      {showMap && (
        <MapWrapper
          type="event"
          title={textOverlayingMap}
          data={filteredEvents}
          floatButton={buttonOnMap}
          mobileView={mobileShowMap}
          setMobileView={setMobileShowMap}
          extraLogic={handleOnMobile}
        />
      )}

      {showList && (
        <div id="filter-events-list">
          <ListPaginated
            list={filteredEvents}
            customPageSize={10}
            renderItem={(item) => <EventCard event={item} key={item.id} />}
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
