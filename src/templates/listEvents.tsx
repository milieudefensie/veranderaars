import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms'; // @ts-expect-error
import { getCombinedEvents, mapCmsEvents, mapCslEvents, mapQomonEvents } from '../utils';
import EventLayout from '../components/Layout/event-layout/event-layout';
import { EventType } from '../types';

import './list-basic.styles.scss';

const ListEvents = ({
  // @ts-expect-error
  pageContext, // @ts-expect-error
  data: { page, allEvents = [], allCSLEvents = [], allQomonEvents = [], collections, favicon, configuration },
}) => {
  const cmsEvents = mapCmsEvents(allEvents);
  const cslEvents = mapCslEvents(allCSLEvents);
  const qomonEvents = mapQomonEvents(allQomonEvents);

  const { title, introduction, highlighEvent, seo, highlightedEventCollection, secondaryFeaturedCollection } = page;
  const mergedEvents = getCombinedEvents(cmsEvents, cslEvents, qomonEvents, true, pageContext?.cslEventsHidden);
  const highlightedEvent = pageContext?.cslHighlightedEvent
    ? mergedEvents.find((e: EventType) => e.slug === pageContext.cslHighlightedEvent)
    : highlighEvent;

  return (
    <Layout bgColor="secondary-bg" extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />
      <EventLayout
        title={title}
        introduction={introduction}
        events={mergedEvents}
        featuredCollection={highlightedEventCollection}
        extraCollection={secondaryFeaturedCollection}
        allCollections={collections.nodes}
        highlightedEvent={highlightedEvent}
        configuration={configuration}
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
    allCSLEvents: allExternalEvent(
      filter: { cancelled_at: { eq: null }, launched_at: { ne: null }, show_in_agenda_list: { eq: true } }
    ) {
      edges {
        node {
          ...CSLEventCard
        }
      }
    }
    allQomonEvents: allQomonEvent {
      edges {
        node {
          id
          slug
          title
          description
          start_at
          end_at
          start_in_zone
          end_in_zone
          image_url
          externalLink
          labels
          location {
            latitude
            longitude
            locality
            query
            region
          }
        }
      }
    }
    cslHighlightEvent: externalEvent(slug: { eq: $cslHighlightedEvent }) {
      ...CSLEventCard
    }
    collections: allDatoCmsEventCollection {
      nodes {
        ...EventCollectionCard
      }
    }
    page: datoCmsListEvent(id: { eq: $id }) {
      id
      title
      introduction
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
    configuration: datoCmsSiteConfiguration {
      cslLocalGroupsSlugs
    }
  }
`;
