import React, { useEffect, useMemo, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import Map from '../components/Global/Map/map';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import { GenericCollectionCard } from '../components/Global/event-collection-card/event-collection-card';
import BlockTestimonial from '../components/Blocks/BlockTestimonial/block-testimonial';
import GroupCard from '../components/Blocks/HighlightGroup/group-card';
import { distanceKm, getCurrentUserCity } from '../utils/location.utils'; // @ts-ignore
import { getCombinedEvents, mapCmsEvents, mapCslEvents } from '../utils';

import './list-basic.styles.scss';

const ListGroups: React.FC<any> = ({
  pageContext,
  data: { page, allGroups = { edges: [] }, allEvents = { edges: [] }, allCSLEvents = { edges: [] }, favicon },
}) => {
  const { seo, title, content } = page;

  const cmsEvents = mapCmsEvents(allEvents);
  const cslEvents = mapCslEvents(allCSLEvents);
  const allEventsList = getCombinedEvents(cmsEvents, cslEvents, true, pageContext?.cslEventsHidden);
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
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

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

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const list = suggestionsRef.current;
      const item = list.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

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

  // helper to get up to 3 upcoming events for a group by distance and date
  const upcomingEventsForGroup = (group: any) => {
    if (!group) return [];
    const eventsWithDistance = allEventsList
      .filter((ev) => ev.coordinates)
      .map((ev) => {
        const evLat = ev.coordinates.latitude;
        const evLng = ev.coordinates.longitude;
        const gLat = group.coordinates?.latitude;
        const gLng = group.coordinates?.longitude;
        const d = gLat && gLng && evLat && evLng ? distanceKm(gLat, gLng, evLat, evLng) : Infinity;

        return { ev, distance: d };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((x) => x.ev);

    return eventsWithDistance;
  };

  const upcomingForActive = useMemo(() => upcomingEventsForGroup(activeGroup), [activeGroup]);

  const scrollToAllGroups = () => {
    if (allGroupsRef.current) allGroupsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <div className="ui-event-layout list-groups">
        <header>
          <div className="container">
            <h1>Onze beweging</h1>
            <p>Sluit je aan bij een lokale groep bij jou in de buurt. Samen staan we sterker!</p>
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
                  setHighlightedIndex(-1);

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
                      e.preventDefault();
                      const selected = citySuggestions[highlightedIndex];
                      setSearchValue(selected);
                      setShowSuggestions(false);
                      setCitySuggestions([]);
                      handleSearch(selected);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                className="search-engine-input"
              />

              {showSuggestions && citySuggestions.length > 0 && (
                <ul className="city-suggestions" ref={suggestionsRef}>
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

          {/* Local Group Block (shown initially based on coords or after search if exact match) */}
          {activeGroup && !notFoundCity ? (
            <div className="local-group-block">
              <GenericCollectionCard
                collection={{
                  title: activeGroup.title,
                  subtitle: `Lokale organizer: ${activeGroup.organizer}`,
                  description: activeGroup.introduction,
                  image: activeGroup.image,
                  ...activeGroup,
                }}
                closestEvents={upcomingForActive}
                ctaTitle="Bekijk de groep"
              />
            </div>
          ) : null}

          {/* Not found block */}
          {notFoundCity ? (
            <div className="not-found-group">
              <div>
                <h2>Er is nog geen groep in {notFoundCity}</h2>
                <p>Bekijk alle groepen in de buurt</p>
                <button className="custom-btn group-v2 big" onClick={scrollToAllGroups}>
                  Bekijk alle groepen
                </button>
              </div>
            </div>
          ) : null}

          <div className="map-container">
            <Map
              data={localGroups}
              type="group"
              mobileView={mobileShowMap}
              setMobileView={setMobileShowMap}
              extraLogic={handleOnMobile}
            />
          </div>

          <div className="custom-blocks">
            {/* {content && <StructuredTextDefault content={content} />} */}

            {/* Testimonial Block - as requested show two general testimonials */}
            <BlockTestimonial
              block={{
                authorName: 'Jan de Boer',
                content:
                  'Ik ben lid geworden van de lokale groep in mijn buurt. We organiseren samen acties en evenementen om het klimaat te beschermen.',
                authorImage: {
                  url: 'https://www.datocms-assets.com/115430/1750248728-kennismakingsavond.jpg?auto=format',
                  alt: 'Photo van Jan de Boer',
                },
              }}
            />
            <BlockTestimonial
              block={{
                authorName: 'Marie Jansen',
                content:
                  'De lokale groep is een geweldige manier om nieuwe mensen te ontmoeten en samen te werken aan een betere toekomst voor onze planeet.',
                authorImage: {
                  url: 'https://www.datocms-assets.com/115430/1750248728-kennismakingsavond.jpg?auto=format',
                  alt: 'Photo van Marie Jansen',
                },
              }}
            />
          </div>

          {/* All Local Groups */}
          <div className="list-groups-block" ref={allGroupsRef}>
            <h3>Alle lokale groepen</h3>
            <div className="groups-items">
              {localGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListGroups;

export const PageQuery = graphql`
  query ListGroupById($id: String, $currentDate: Date!) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    allGroups: allDatoCmsGroup(sort: { title: ASC }) {
      edges {
        node {
          id
          title
          slug
          introduction
          organizer
          coordinates {
            latitude
            longitude
          }
          model {
            apiKey
          }
          image {
            url
            gatsbyImageData(width: 900, height: 505)
          }
          tags {
            ... on DatoCmsTag {
              id
              title
            }
          }
        }
      }
    }
    allEvents: allDatoCmsEvent(filter: { closeEvent: { ne: true }, date: { gte: $currentDate } }) {
      edges {
        node {
          ...EventCard
        }
      }
    }
    allCSLEvents: allExternalEvent(filter: { cancelled_at: { eq: null } }) {
      edges {
        node {
          __typename
          id: slug
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
            street
            query
            region
            locality
          }
          calendar {
            name
            slug
          }
          hiddenAddress
          waiting_list_enabled
          max_attendees_count
          additional_image_sizes_url {
            url
            style
          }
        }
      }
    }
    page: datoCmsListGroup(id: { eq: $id }) {
      id
      title
      slug
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
          # ...BlockTestimonial
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
