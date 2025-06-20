import React, { useEffect, useRef } from 'react';
import { createMapMarkers, createMapReference } from './utils';
import { useTranslate } from '@tolgee/react';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DataItem {
  coordinates?: Coordinates;
  [key: string]: any; // Additional fields can be added here depending on the structure of data items
}

interface BasicMapProps {
  title?: string;
  data?: DataItem[];
  type?: 'event' | 'group'; // You can extend this type if there are other types of markers
  mobileView?: boolean;
  setMobileView?: React.Dispatch<React.SetStateAction<boolean>>; // Function to set mobile view state
}

const BasicMap: React.FC<BasicMapProps> = ({ title, data = [], type = 'event', mobileView = false, setMobileView }) => {
  const { t } = useTranslate();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialCoordinates: [number, number] = [4.9041, 52.25];
    const map = createMapReference(mapContainerRef, initialCoordinates, 20, 5, 6.65, true);

    const pins = data
      .filter((e) => e.coordinates && e.coordinates.latitude && e.coordinates.longitude)
      .map((e) => ({
        ...e,
        coordinates: [e.coordinates.longitude, e.coordinates.latitude],
      }));

    createMapMarkers(map, pins, type);

    return () => map.remove();
  }, [data, mobileView, type]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        <div className="pre-header">
          <div className="container">
            <div className="action" onClick={() => setMobileView && setMobileView((prev) => !prev)}>
              <span>←</span>
              <span>{t('back_to_list')}</span>
            </div>
          </div>
        </div>

        <div ref={mapContainerRef} className="map-container" />
      </div>
    </div>
  );
};

export default BasicMap;
