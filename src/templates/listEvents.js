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

  const { title, seo, highlighEvent, buttonOnMap, content } = page;
  const mergedEvents = getCombinedEvents(cmsEvents, cslEvents, true, pageContext?.cslEventsHidden);
  const maybeEventHighlighted = cslHighlightEvent ? formatCslEvents(cslHighlightEvent) : highlighEvent;

  return (
    <Layout bgColor="secondary-bg" extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />
      <EventLayout events={mergedEvents} highlighEvent={maybeEventHighlighted} />
    </Layout>
  );

  // return (
  //   <Layout bgColor="secondary-bg" extraClassNames="list-pages">
  //     <SeoDatoCMS seo={seo} favicon={favicon} />

  //     <WrapperLayout variant="white" responsiveVariant="secondary-bg">
  //       <HeroBasic backgroundColor="light" responsiveVariant="event" />

  //       <div className="list-event-wrapper">
  //         <div className="container">
  //           {title && <h1>{title}</h1>}

  //           {(cslHighlightEvent || highlighEvent) && (
  //             <div className="highlighted-event-wrapper">
  //               <EventCard event={formatCslEvents(cslHighlightEvent) || highlighEvent} isHighlighted />
  //             </div>
  //           )}

  //           <div className={`${mobileShowMap ? 'mobile-map' : ''}`}>
  //             <Map
  //               type="event"
  //               floatButton={buttonOnMap}
  //               title={title}
  //               data={filteredEvents}
  //               mobileView={mobileShowMap}
  //               setMobileView={setMobileShowMap}
  //               extraLogic={() => {
  //                 if (window !== undefined && window.innerWidth < 992) {
  //                   setMobileShowMap((prev) => !prev);
  //                 }
  //               }}
  //             />

  //             <FilterEvents
  //               events={filteredEvents}
  //               locations={locationOptions}
  //               handleOnApplyNewFilters={(newFilterValues) =>
  //                 setFilterValues((prev) => ({ ...prev, ...newFilterValues }))
  //               }
  //             />

  //             <FloatCta title="Bekijk lijst" id="filter-events-list" isArrowVisible={isArrowVisible} />
  //           </div>
  //         </div>

  //         {content && (
  //           <div className="container mt-5 pb-5">
  //             <StructuredTextDefault content={content} />
  //           </div>
  //         )}
  //       </div>
  //     </WrapperLayout>
  //   </Layout>
  // );
};

export default ListEvents;

export const ListEventQuery = graphql`
  query ListEventById($id: String, $currentDate: Date!, $cslHighlightedEvent: String, $language: String!) {
    locales: allLocale(filter: { ns: { in: ["index"] }, language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    allEvents: allDatoCmsEvent(filter: { closeEvent: { ne: true }, date: { gte: $currentDate } }) {
      edges {
        node {
          id
          title
          slug
          externalLink
          introduction
          date
          rawDate: date
          hourStart
          hourEnd
          onlineEvent
          address
          region
          coordinates {
            latitude
            longitude
          }
          tags {
            ... on DatoCmsTag {
              id
              title
            }
          }
          image {
            url
            gatsbyImageData
          }
          model {
            apiKey
          }
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
            query
            region
          }
          calendar {
            name
            slug
          }
          hiddenAddress
          waiting_list_enabled
          max_attendees_count
        }
      }
    }
    cslHighlightEvent: externalEvent(slug: { eq: $cslHighlightedEvent }) {
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
        query
        region
      }
      calendar {
        name
        slug
      }
      hiddenAddress
      waiting_list_enabled
      max_attendees_count
    }
    page: datoCmsListEvent(id: { eq: $id }) {
      id
      title
      slug
      buttonOnMap {
        ...AppCta
      }
      highlighEvent {
        ... on DatoCmsEvent {
          id
          title
          slug
          externalLink
          introduction
          date
          hourStart
          hourEnd
          tags {
            ... on DatoCmsTag {
              id
              title
            }
          }
          image {
            gatsbyImageData(width: 900, height: 505)
          }
          model {
            apiKey
          }
        }
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
