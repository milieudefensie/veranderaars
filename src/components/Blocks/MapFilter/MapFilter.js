import React, { useEffect, useState } from 'react';
import MapWrapper from '../../Global/Map/Map';
import { graphql, useStaticQuery } from 'gatsby';
import { mapCmsEvents, mapCslEvents } from '../../../utils';
import ListPaginated from '../../Global/Pagination/ListPaginated';
import EventCard from '../HighlightEvent/EventCard';
import useCSLEvents from '../../../hooks/useCSLEvents';

import './styles.scss';

const MapFilter = ({ block }) => {
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const { filterBy = {}, labelsInCsl, textOverlayingMap, showMap, showList, buttonOnMap } = block;

  const { allDatoCmsEvent: events, cslEvents } = useStaticQuery(graphql`
    query events {
      cslEvents: allExternalEvent {
        edges {
          node {
            id
            slug
            title
            description
            start_at
            end_at
            image_url
            labels
            location {
              latitude
              longitude
              venue
              query
              region
            }
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
    if (!labelsInCsl && !filterBy?.id) return true;

    const isCSLEvent = e.type === 'CSL';
    if (isCSLEvent) {
      return e.labels?.includes(labelsInCsl);
    }

    return e.tags?.some((t) => t.id === filterBy?.id);
  });

  useEffect(() => {
    const handleWindowResize = () => {
      const htmlElement = document.documentElement;

      if (mobileShowMap && window.innerWidth < 992) {
        htmlElement.style.overflow = 'hidden';
      } else {
        htmlElement.style.overflow = '';
      }
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileShowMap]);

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
