import React, { useEffect, useState } from 'react';
import MapWrapper from '../../Global/Map/Map';
import { graphql, useStaticQuery } from 'gatsby';
import { mapCmsEvents } from '../../../utils';
import ListPaginated from '../../Global/Pagination/ListPaginated';
import EventCard from '../HighlightEvent/EventCard';
import useCSLEvents from '../../../hooks/useCSLEvents';
import Spinner from '../../Global/Spinner/Spinner';

import './styles.scss';

const MapFilter = ({ block }) => {
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const { filterBy = {}, labelsInCsl, textOverlayingMap, showMap, buttonOnMap } = block;

  const { allDatoCmsEvent: events } = useStaticQuery(graphql`
    query events {
      allDatoCmsEvent {
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

  const cmsEvents = filterBy.id
    ? mapCmsEvents(events).filter((e) => e.tags.some((t) => t.id === filterBy.id))
    : mapCmsEvents(events);

  const { mergedEvents, status } = useCSLEvents(cmsEvents);

  const filteredEvents = mergedEvents.filter((e) =>
    e.tags.some((t) => t.id === filterBy?.id || t.labels?.includes(labelsInCsl))
  );

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

      {status === 'loading' ? (
        <div style={{ textAlign: 'center' }}>
          <Spinner />
        </div>
      ) : (
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
