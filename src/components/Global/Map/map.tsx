import React, { useEffect, useRef, useState } from 'react';
import Map, { MapProps, Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import GroupMarker from './Marker/group-marker';
import CustomMarker from './Marker/marker';
import SignalMarker from './Marker/signal-marker';
import MapPopup from './MapPopup/map-popup';
import useSupercluster from 'use-supercluster';
import CtaHandler from '../Cta/cta-handler';
import Cta from '../Cta/cta';
import WPGroupMarker from './Marker/wp-group-marker';
import { useTranslate } from '@tolgee/react';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

interface Pin {
  id: string;
  title: string;
  rawDate: string;
  date: string;
  hourStart: string;
  hourEnd: string;
  address: string;
  startInZone: string;
  endInZone: string;
  image: string;
  tags: string[];
  type: string;
  url: string;
  slug: string;
  externalLink: string;
  model: string;
  whatsappGroup: string;
  signalChat: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapWrapperProps {
  title?: string;
  data: Pin[];
  type?: string;
  mobileView?: boolean;
  setMobileView: React.Dispatch<React.SetStateAction<boolean>>;
  floatButton?: any;
  extraLogic?: () => void;
  initialCenter?: { latitude: number; longitude: number; zoom?: number } | null;
}

const DEFAULT_LATITUDE = 52.25;
const DEFAULT_LONGITUDE = 4.9041;
const DEFAULT_ZOOM = 6.65;

const MapWrapper: React.FC<MapWrapperProps> = ({
  title,
  data = [],
  type = 'event',
  mobileView = false,
  setMobileView,
  floatButton = null,
  extraLogic = null,
  initialCenter = null,
}) => {
  const { t } = useTranslate();
  const mapRef = useRef<any>(null);
  const appliedInitialCenterRef = useRef(false);

  const [viewport, setViewport] = useState<MapProps>({
    latitude: initialCenter?.latitude ?? DEFAULT_LATITUDE,
    longitude: initialCenter?.longitude ?? DEFAULT_LONGITUDE,
    zoom: initialCenter?.zoom ?? DEFAULT_ZOOM,
    interactive: true,
    scrollZoom: true,
  });
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [scroll, setScroll] = useState<number | null>(null);

  useEffect(() => {
    if (initialCenter && !appliedInitialCenterRef.current) {
      appliedInitialCenterRef.current = true;
      setViewport((prev) => ({
        ...prev,
        latitude: initialCenter.latitude,
        longitude: initialCenter.longitude,
        zoom: initialCenter.zoom ?? 12,
      }));
      mapRef.current?.resize();
    }
  }, [initialCenter]);

  const resizeMapOnMobile = () => {
    const isMobile = window.innerWidth <= 992;
    const isExtraMobile = window.innerWidth <= 767;
    setIsMobileDevice(isMobile);

    if (isMobile) {
      if (mobileView) {
        setViewport((prev) =>
          appliedInitialCenterRef.current ? prev : { ...prev, zoom: 6.26, longitude: 5.5, latitude: 52 }
        );
        mapRef.current?.resize();
        return;
      }

      setViewport((prev) => ({ ...prev, zoom: isExtraMobile ? 5.6 : 5.4 }));
      mapRef.current?.resize();
    }
  };

  const handleOnScroll = () => {
    if (typeof window !== 'undefined') {
      const position = window.pageYOffset;
      setScroll(position);
    }
  };

  useEffect(() => {
    resizeMapOnMobile();

    window.addEventListener('resize', resizeMapOnMobile);
    window.addEventListener('scroll', handleOnScroll);

    return () => {
      console.log({ mobileView });

      window.removeEventListener('resize', resizeMapOnMobile);
      window.removeEventListener('scroll', handleOnScroll);
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
        rawDate: e.rawDate,
        date: e.date,
        hourStart: e.hourStart,
        hourEnd: e.hourEnd,
        address: e.address,
        startInZone: e.startInZone,
        endInZone: e.endInZone,
        image: e.image,
        tags: e.tags || [],
        type: e.type,
        url: e.url,
        slug: e.slug,
        externalLink: e.externalLink,
        model: e.model,
        whatsappGroup: e.whatsappGroup,
        signalChat: e.signalChat,
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
    options: { radius: isMobileDevice ? 50 : 75, maxZoom: 20 }, // radius 75
  });

  return (
    <div id="map-wrapper-id" className={`map-wrapper ${mobileView ? 'mobile' : ''}`}>
      {title && !error && <h3>{title}</h3>}

      <div className="map">
        <div className="pre-header">
          <div className="container">
            <div
              className="action"
              onClick={() => {
                setMobileView(false);
                setSelectedMarker(null);
              }}
            >
              <span>←</span>
              <span>{t('back_to_list')}</span>
            </div>
          </div>
        </div>

        <Map
          {...viewport}
          ref={mapRef}
          mapStyle={process.env.GATSBY_MAPBOX_STYLE_URL}
          mapboxAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
          onMove={(evt) => setViewport(evt.viewState)}
          onLoad={(evt) => evt.target.setZoom(viewport.zoom!)}
          dragRotate={false}
          touchPitch
          touchZoomRotate
          scrollZoom={false} // if enabled, we can use notebook trackpad
          onError={(err) => {
            console.error('Error loading complex map: ', err.error.message);
            setError((prev) => !prev);
          }}
        >
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            // @ts-ignore
            const { cluster: isCluster, point_count: pointCount } = cluster.properties;

            if (isCluster) {
              return (
                <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
                  <div
                    className={`cluster-marker ${type}`}
                    style={{
                      width: `${10 + (pointCount / pins.length) * 20}px`,
                      height: `${10 + (pointCount / pins.length) * 20}px`,
                    }}
                    onClick={() => {
                      const COORD_EPSILON = 1e-6; // ~0.1m, well below any real distinct address
                      const leaves = supercluster.getLeaves(cluster.id, Infinity);
                      const allSameCoords = leaves.every((leaf: any) => {
                        const [leafLongitude, leafLatitude] = leaf.geometry.coordinates;
                        return (
                          Math.abs(leafLongitude - longitude) < COORD_EPSILON &&
                          Math.abs(leafLatitude - latitude) < COORD_EPSILON
                        );
                      });

                      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                      const cannotExpandFurther = expansionZoom <= (viewport.zoom ?? 0);

                      if (allSameCoords || cannotExpandFurther) {
                        setSelectedMarker({
                          geometry: cluster.geometry,
                          properties: { isClusterList: true, leaves: leaves.map((leaf: any) => leaf.properties) },
                        });
                        return;
                      }

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
                latitude={latitude}
                longitude={longitude}
                onClick={() => {
                  setSelectedMarker(cluster);

                  // Animation to center marker/popup
                  if (!isMobileDevice) {
                    const px = mapRef.current?.project([longitude, latitude]);
                    px.y += 200 / 2;
                    mapRef.current?.panTo(mapRef.current?.unproject(px), {
                      animate: true,
                      duration: 500,
                    });
                  }

                  if (extraLogic) {
                    extraLogic();
                  }
                }}
                anchor="bottom"
              >
                {type === 'wp-group' ? (
                  <WPGroupMarker />
                ) : type === 'group' ? (
                  <GroupMarker />
                ) : type === 'signal' ? (
                  <SignalMarker />
                ) : (
                  <CustomMarker />
                )}
              </Marker>
            );
          })}

          {selectedMarker && (
            <Popup
              key={selectedMarker.properties.id || 'cluster-list'}
              longitude={selectedMarker.geometry.coordinates[0]}
              latitude={selectedMarker.geometry.coordinates[1]}
              closeOnClick={false}
              onClose={() => {
                setSelectedMarker(null);
                if (extraLogic) {
                  extraLogic();
                }
              }}
            >
              {selectedMarker.properties.isClusterList ? (
                <MapPopup cardType={type} cards={selectedMarker.properties.leaves} />
              ) : (
                <MapPopup cardType={type} card={selectedMarker.properties} />
              )}
            </Popup>
          )}

          <NavigationControl position="bottom-right" />

          {/* Mobile full screen toggler */}
          {setMobileView && (
            <div className="mobile-view-map">
              <CtaHandler
                title={t('open_map')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path
                      d="M21.5 15.344L19.379 17.465L16.207 14.293L14.793 15.707L17.965 18.879L15.844 21H21.5V15.344ZM3.5 8.656L5.621 6.535L8.793 9.707L10.207 8.293L7.035 5.121L9.156 3H3.5V8.656ZM21.5 3H15.844L17.965 5.121L14.793 8.293L16.207 9.707L19.379 6.535L21.5 8.656V3ZM3.5 21H9.156L7.035 18.879L10.207 15.707L8.793 14.293L5.621 17.465L3.5 15.344V21Z"
                      fill="black"
                    />
                  </svg>
                }
                isPrimaryButton
                handleOnClick={() => setMobileView(true)}
              />
            </div>
          )}

          {/* Floating button */}
          {floatButton && floatButton[0] && (
            <div className="map-floating-button">
              <Cta cta={floatButton[0]} />
            </div>
          )}
        </Map>

        {/* Floating button */}
        {floatButton && floatButton[0] && (
          <div className="mobile-map-floating-button">
            <Cta cta={floatButton[0]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWrapper;
