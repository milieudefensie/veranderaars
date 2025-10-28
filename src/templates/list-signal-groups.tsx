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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchValue.trim();
    if (!query) {
      setSearchResultGroup(null);
      setNotFoundCity(null);
      return;
    }

    const match = localGroups.find((g) => (g.title || '').toLowerCase() === query.toLowerCase());
    if (match) {
      setSearchResultGroup(match);
      setNotFoundCity(null);
      return;
    }

    setSearchResultGroup(null);
    setNotFoundCity(query);
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
          <form className="search-engine" onSubmit={handleSearch}>
            <div className="search-engine-header">
              <span className="help">Woonplaats</span>
              <span className="ip">Locatie op basis van je IP</span>
            </div>
            <div className="search-engine-row">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={userCoords ? userCoords.city : 'Woonplaats'}
                className="search-engine-input"
              />
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
            {/* @ts-ignore */}
            <Map data={localGroups} type="signal" />
          </div>

          <div className="custom-blocks">
            <StructuredTextDefault content={content} />{' '}
          </div>

          <div className="list-groups-block" ref={allGroupsRef}>
            <h3>Alle Signal groepen</h3>
            <div className="groups-items">
              {localGroups.map((group) => (
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
    allGroups: allDatoCmsGroup(sort: { title: ASC }, filter: { signalChat: { ne: null } }) {
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
