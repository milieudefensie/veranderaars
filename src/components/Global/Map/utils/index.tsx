import React from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl, { Map } from '!mapbox-gl';
import Marker from '../Marker/marker';
import ReactDOMServer from 'react-dom/server';
import GroupMarker from '../Marker/group-marker';
import MapPopup from '../MapPopup/map-popup';

interface Pin {
  coordinates: [number, number];
  [key: string]: any;
}

const { Popup } = mapboxgl;

export const createMapReference = (
  ref: React.RefObject<HTMLElement>,
  coordinates: [number, number],
  maxZoom: number,
  minZoom: number,
  zoom: number,
  interactive = false
): Map => {
  const map = new mapboxgl.Map({
    container: ref.current!,
    accessToken: 'pk.eyJ1IjoibWFydGluYWx2IiwiYSI6ImNscHR1YjdvZDBlY2sybHBnNTRwM2l4ZTEifQ.nn8C3qy8ULBkq6gdO3vlCg',
    style: 'mapbox://styles/martinalv/clptudeob00ub01p74jlnbdce',
    center: coordinates,
    interactive,
    maxZoom,
    minZoom,
    zoom,
  });

  map.scrollZoom.disable();
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  return map;
};

export const createMapMarkers = (mapRef: Map, pins: Pin[], type: 'group' | 'individual'): void => {
  mapRef.on('load', () => {
    mapRef.addSource('countries', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' });

    for (const pin of pins) {
      const markerElement = document.createElement('div');
      const root = createRoot(markerElement);
      root.render(type === 'group' ? <GroupMarker /> : <Marker />);

      // Create a Mapbox Marker at our new DOM node
      const marker = new mapboxgl.Marker(markerElement).setLngLat(pin.coordinates).addTo(mapRef);

      // Add a Popup to the marker
      const popupContent = ReactDOMServer.renderToString(
        <MapPopup card={pin} linkTitle={type === 'group' ? 'Meld je aan' : 'Meld je aan'} />
      );
      const popup = new Popup({ offset: 25 }).setHTML(popupContent);
      marker.setPopup(popup);
    }
  });
};

export const centerMapOn = (mapRef: Map, newCoordinates: [number, number], newZoom: number): void => {
  mapRef.setCenter(newCoordinates);
  mapRef.setZoom(newZoom);
};
