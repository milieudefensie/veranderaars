import React, { useEffect, useRef } from 'react';
import { createMapMarkers, createMapReference } from './utils';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

const BasicMap = ({ title, data = [], type = 'event', mobileView = false, setMobileView }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const initialCoordinates = [4.9041, 52.25];
    const map = createMapReference(mapContainerRef, initialCoordinates, 20, 5, 6.65, true);

    const pins = data
      .filter((e) => e.coordinates && e.coordinates.latitude && e.coordinates.longitude)
      .map((e) => ({
        ...e,
        coordinates: [e.coordinates.longitude, e.coordinates.latitude],
      }));

    createMapMarkers(map, pins, type);

    return () => map.remove();
  }, [data, mobileView]);

  useEffect(() => {
    if (window) {
      const scrollToTop = () => {
        window.scrollTo({ top: 0 });
      };

      scrollToTop();
    }
  }, [mobileView]);

  return (
    <div className={`map-wrapper ${mobileView ? 'mobile' : ''}`}>
      {title && <h3>{title}</h3>}

      <div className="map">
        {/* Pre-header */}
        <div className="pre-header">
          <div className="container">
            <div className="action" onClick={() => setMobileView((prev) => !prev)}>
              <span>←</span>
              <span>{type === 'event' ? 'Bekijk lijst' : 'Bekijk lijst'}</span>
            </div>
          </div>
        </div>

        <div ref={mapContainerRef} className="map-container" />
      </div>
    </div>
  );
};

export default BasicMap;
