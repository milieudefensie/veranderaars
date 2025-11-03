import React, { useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import Map from '../components/Global/Map/map';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import { GenericCollectionCard } from '../components/Global/event-collection-card/event-collection-card';
import { distanceKm, getCurrentUserCity } from '../utils/location.utils';
import { QRCodeSVG } from 'qrcode.react';
import GroupSignalCard from '../components/Blocks/HighlightGroup/group-signal-card';

import './list-basic.styles.scss';

const ListSignalGroups: React.FC<any> = ({ data: { page, allGroups, favicon } }) => {
  const { seo, title, introduction, content } = page;

  const localGroups = Array.isArray(allGroups.edges) ? allGroups.edges.map((raw: any) => raw.node) : [];

  const [searchValue, setSearchValue] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [nearestGroup, setNearestGroup] = useState<any | null>(null);
  const [searchResultGroup, setSearchResultGroup] = useState<any | null>(null);
  const [notFoundCity, setNotFoundCity] = useState<string | null>(null);
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const allGroupsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getCurrentUserCity().then((cityData) => {
      if (cityData) {
        setUserCoords({
          lat: cityData.latitude,
          lng: cityData.longitude,
          city: cityData.city,
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      const htmlElement = document.documentElement;
      const navbar = document.querySelector('#header-mobile-wrapper') as HTMLElement;
      setMobileDevice(window.innerWidth < 992);

      if (!navbar) return;

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
      // Reset html overflow
      const htmlElement = document.documentElement;
      htmlElement.style.overflow = '';

      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileShowMap]);

  useEffect(() => {
    if (userCoords && localGroups.length) {
      let best = null;
      let bestDist = Infinity;
      for (const g of localGroups) {
        if (!g.coordinates || !g.coordinates.latitude || !g.coordinates.longitude) continue;
        const d = distanceKm(userCoords.lat, userCoords.lng, g.coordinates.latitude, g.coordinates.longitude);
        if (d < bestDist) {
          bestDist = d;
          best = { group: g, distance: d };
        }
      }
      if (best) setNearestGroup(best.group);
    }
  }, [userCoords, localGroups]);

  const handleSearch = (query?: string) => {
    const searchQuery = query ?? searchValue.trim();
    if (!searchQuery) {
      setSearchResultGroup(null);
      setNotFoundCity(null);
      return;
    }

    const match = localGroups.find((g) => (g.title || '').toLowerCase() === searchQuery.toLowerCase());
    if (match) {
      setSearchResultGroup(match);
      setNotFoundCity(null);
      return;
    }

    setSearchResultGroup(null);
    setNotFoundCity(searchQuery);
  };

  const handleOnMobile = () => {
    if (mobileDevice) {
      setMobileShowMap(true);
    }
  };

  const activeGroup = searchResultGroup || nearestGroup;

  const scrollToAllGroups = () => {
    if (allGroupsRef.current) allGroupsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <div className="ui-event-layout list-groups signal-groups">
        <header>
          <div className="container">
            <h1>{title}</h1>
            <p>{introduction}</p>
          </div>
        </header>

        <div className="container negative-margin">
          <form
            className="search-engine"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="search-engine-header">
              <span className="help">Woonplaats</span>
              <span className="ip">Locatie op basis van je IP</span>
            </div>

            <div className="search-engine-row" style={{ position: 'relative' }}>
              <input
                type="text"
                name="city"
                autoComplete="off"
                placeholder={userCoords ? userCoords.city : 'Woonplaats'}
                value={searchValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchValue(value);
                  setHighlightedIndex(-1); // reinicia la selección

                  if (value.length > 1 && localGroups.length > 0) {
                    const filtered = localGroups
                      .map((g) => g.title)
                      .filter((title) => title.toLowerCase().includes(value.toLowerCase()));
                    setCitySuggestions(filtered);
                    setShowSuggestions(true);
                  } else {
                    setCitySuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchValue.length > 1 && citySuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions || citySuggestions.length === 0) return;

                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev < citySuggestions.length - 1 ? prev + 1 : 0));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : citySuggestions.length - 1));
                  } else if (e.key === 'Enter') {
                    if (highlightedIndex >= 0 && citySuggestions[highlightedIndex]) {
                      e.preventDefault(); // evita el submit automático
                      const selected = citySuggestions[highlightedIndex];
                      setSearchValue(selected);
                      setShowSuggestions(false);
                      setCitySuggestions([]);
                      handleSearch(selected); // 🔹 ejecuta la búsqueda inmediatamente
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                className="search-engine-input"
              />

              {showSuggestions && citySuggestions.length > 0 && (
                <ul className="city-suggestions">
                  {citySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={`city-suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const selected = suggestion;
                        setSearchValue(selected);
                        setCitySuggestions([]);
                        setShowSuggestions(false);
                        handleSearch(selected);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>

          {activeGroup && !notFoundCity ? (
            <div className="local-group-block">
              <GenericCollectionCard
                collection={{
                  title: activeGroup.title,
                  subtitle: `Signal`,
                  description: activeGroup.introduction,
                  image: activeGroup.image,
                  ...activeGroup,
                }}
                customLink={activeGroup.signalChat}
                ctaTitle="💬 Open de Signal groep"
                ctaVariant="orange"
                customImage={
                  <QRCodeSVG className="signal-qr" value={activeGroup.signalChat} size={300} bgColor="#Fff" />
                }
              />
            </div>
          ) : null}

          {/* Not found block */}
          {notFoundCity ? (
            <div className="not-found-group signal">
              <div>
                <h2>Er is nog geen signal groep in {notFoundCity}</h2>
                <p>Bekijk andere Signal groepen in de buurt</p>
                <button className="custom-btn group-v2 big orange" onClick={scrollToAllGroups}>
                  Bekijk andere Signal groepen
                </button>
              </div>
            </div>
          ) : null}

          <div className="map-container">
            <Map
              data={localGroups}
              type="signal"
              mobileView={mobileShowMap}
              setMobileView={setMobileShowMap}
              extraLogic={handleOnMobile}
            />
          </div>

          <div className="custom-blocks">
            <StructuredTextDefault content={content} />{' '}
          </div>

          <div className="list-groups-block" ref={allGroupsRef}>
            <h3>Alle Signal groepen</h3>
            <div className="groups-items">
              {localGroups.map((group: any) => (
                <GroupSignalCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListSignalGroups;

export const ListSignalGroupsQuery = graphql`
  query ListSignalGroupsById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    allGroups: allDatoCmsGroup(sort: { title: ASC }, filter: { signalChat: { ne: null, nin: [""] } }) {
      edges {
        node {
          id
          slug
          title
          introduction
          signalChat
          coordinates {
            latitude
            longitude
          }
          image {
            url
          }
          model {
            apiKey
          }
        }
      }
    }
    page: datoCmsListSignalGroup(id: { eq: $id }) {
      id
      title
      introduction
      content {
        value
        blocks {
          __typename
          ...BlockMap
          ...BlockNarrativeBlock
          ...BlockAccordion
          ...BlockImage
          ...BlockShare
          ...BlockHighlightTools
          ...BlockHighlightEvent
          ...BlockTable
          ...BlockEmbedIframe
          ...BlockVideo
          ...BlockTextHubspot
          ...BlockColumns
          ...BlockCountdown
          ...BlockCtaList
          ...BlockCtaIconsList
          ...BlockImageGallery
          ...BlockCustomCta
          ...BlockTestimonial
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
