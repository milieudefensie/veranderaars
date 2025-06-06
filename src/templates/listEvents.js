import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import { formatCslEvents, getCombinedEvents, mapCmsEvents, mapCslEvents } from '../utils';
import EventLayout from '../components/Layout/event-layout/event-layout';

import './list-basic.styles.scss';

const ListEvents = ({ pageContext, data: { page, allEvents = [], allCSLEvents = [], cslHighlightEvent, favicon } }) => {
  const cmsEvents = mapCmsEvents(allEvents);
  const cslEvents = mapCslEvents(allCSLEvents);

  const { title, seo, highlighEvent, highlightedEventCollection, secondaryFeaturedCollection, buttonOnMap, content } =
    page;
  const mergedEvents = getCombinedEvents(cmsEvents, cslEvents, true, pageContext?.cslEventsHidden);
  // const maybeEventHighlighted = cslHighlightEvent ? formatCslEvents(cslHighlightEvent) : highlighEvent;

  return (
    <Layout bgColor="secondary-bg" extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />
      <EventLayout
        events={mergedEvents}
        featuredCollection={highlightedEventCollection}
        extraCollection={secondaryFeaturedCollection}
      />
    </Layout>
  );
};

export default ListEvents;

export const ListEventQuery = graphql`
  query ListEventById($id: String, $currentDate: Date!, $cslHighlightedEvent: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
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
          ...CSLEventCard
        }
      }
    }
    cslHighlightEvent: externalEvent(slug: { eq: $cslHighlightedEvent }) {
      ...CSLEventCard
    }
    page: datoCmsListEvent(id: { eq: $id }) {
      id
      title
      slug
      buttonOnMap {
        ...AppCta
      }
      highlighEvent {
        ...EventCard
      }
      highlightedEventCollection {
        ...EventCollectionCard
      }
      secondaryFeaturedCollection {
        ...EventCollectionCard
      }
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
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
