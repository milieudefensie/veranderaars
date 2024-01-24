import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, Popup, NavigationControl } from 'react-map-gl';
import GroupMarker from './Marker/GroupMarker';
import CustomMarker from './Marker/Marker';
import MapPopup from './MapPopup/MapPopup';
import useSupercluster from 'use-supercluster';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

const MapWrapper = ({ title, data = [], type = 'event', mobileView = false, setMobileView }) => {
  const mapRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 52.25,
    longitude: 4.9041,
    zoom: 6.5,
    interactive: true,
    scrollZoom: true,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [error, setError] = useState(false);

  const resizeMapOnMobile = () => {
    const isMobile = window.innerWidth <= 992;

    if (isMobile) {
      const boundingBox = [
        [3.31497114423, 50.803721015],
        [7.09205325687, 53.5104033474],
      ];

      mapRef.current?.fitBounds(boundingBox);
    }
  };

  useEffect(() => {
    resizeMapOnMobile();
    window.addEventListener('resize', resizeMapOnMobile);

    return () => {
      window.removeEventListener('resize', resizeMapOnMobile);
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (window) {
      const scrollToTop = () => window.scrollTo({ top: 0 });
      scrollToTop();
    }
    mapRef.current?.resize();
    resizeMapOnMobile();
  }, [mobileView]);

  const pins = data
    .filter((e) => e.coordinates && e.coordinates.latitude && e.coordinates.longitude)
    .map((e) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        id: e.id,
        title: e.title,
        date: e.date,
        hourStart: e.hourStart,
        hourEnd: e.hourEnd,
        address: e.address,
        image: e.image,
        tags: e.tags || [],
        type: e.type,
        url: e.url,
        slug: e.slug,
        externalLink: e.externalLink,
        model: e.model,
      },
      geometry: {
        type: 'Point',
        coordinates: [e.coordinates.longitude, e.coordinates.latitude],
      },
    }));

  // Clusters
  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  const { clusters, supercluster } = useSupercluster({
    points: pins,
    bounds,
    zoom: viewport?.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div id="map-wrapper-id" className={`map-wrapper ${mobileView ? 'mobile' : ''}`}>
      {title && !error && <h3>{title}</h3>}

      <div className="map">
        <div className="pre-header">
          <div className="container">
            <div className="action" onClick={() => setMobileView((prev) => !prev)}>
              <span>←</span>
              <span>{type === 'event' ? 'Bekijk lijst' : 'Bekijk lijst'}</span>
            </div>
          </div>
        </div>

        <Map
          {...viewport}
          ref={mapRef}
          mapStyle="mapbox://styles/martinalv/clptudeob00ub01p74jlnbdce"
          mapboxAccessToken={
            'pk.eyJ1IjoibWFydGluYWx2IiwiYSI6ImNscHR1YjdvZDBlY2sybHBnNTRwM2l4ZTEifQ.nn8C3qy8ULBkq6gdO3vlCg'
          }
          onMove={(evt) => setViewport(evt.viewState)}
          onLoad={(evt) => evt.target.setZoom(viewport.zoom)}
          scrollZoom={false}
          dragRotate={false}
          touchZoomRotate={false}
          onError={(err) => {
            console.error('Error loading complex map: ', err.error.message);
            setError((prev) => !prev);
          }}
        >
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;

            if (isCluster) {
              return (
                <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (pointCount / pins.length) * 20}px`,
                      height: `${10 + (pointCount / pins.length) * 20}px`,
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);

                      setViewport({
                        ...viewport,
                        latitude,
                        longitude,
                        zoom: expansionZoom,
                      });
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={cluster.properties.id}
                longitude={longitude}
                latitude={latitude}
                onClick={() => setSelectedMarker(cluster)}
                anchor="center"
              >
                {type === 'group' ? <GroupMarker /> : <CustomMarker />}
              </Marker>
            );
          })}

          {selectedMarker && (
            <Popup
              key={selectedMarker.properties.id}
              longitude={selectedMarker.geometry.coordinates[0]}
              latitude={selectedMarker.geometry.coordinates[1]}
              closeOnClick={false}
              onClose={() => setSelectedMarker(null)}
            >
              <MapPopup card={selectedMarker.properties} />
            </Popup>
          )}

          <NavigationControl position="bottom-right" />
        </Map>
      </div>
    </div>
  );
};

export default MapWrapper;
