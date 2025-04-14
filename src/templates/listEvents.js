import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import EventCard from '../components/Blocks/HighlightEvent/EventCard';
import Map from '../components/Global/Map/Map';
import FilterEvents from '../components/Global/FilterEvents/FilterEvents';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import FloatCta from '../components/Global/FloatCta/FloatCta';
import useCSLEvents from '../hooks/useCSLEvents';
import { formatCslEvents, mapCmsEvents, mapCslEvents } from '../utils';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/StructuredTextDefault';

import './list-basic.styles.scss';
import EventLayout from '../components/Layout/event-layout/event-layout';

const ListEvents = ({ pageContext, data: { page, allEvents = [], allCSLEvents = [], cslHighlightEvent, favicon } }) => {
  const cmsEvents = mapCmsEvents(allEvents);
  const cslEvents = mapCslEvents(allCSLEvents);

  const { title, seo, highlighEvent, buttonOnMap, content } = page;

  const [filterValues, setFilterValues] = useState({ location: null, typeOfEvent: null, description: null });
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  const { mergedEvents, setFilteredEvents, filteredEvents, locationOptions, status } = useCSLEvents(
    cmsEvents,
    cslEvents,
    true,
    pageContext?.cslEventsHidden
  );

  useEffect(() => {
    // Arrow style (up or down)
    const handleScroll = () => {
      const testElement = document.getElementById('filter-events-list');
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const testElementPosition = testElement?.offsetTop;

      setIsArrowVisible(scrollPosition + 650 < testElementPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [status]);

  useEffect(() => {
    const filteredEvents = [...mergedEvents]
      .filter((e) => {
        if (filterValues.location === 'online') {
          return Boolean(e.onlineEvent) === true;
        } else {
          return (
            filterValues.location === null || filterValues.location === 'All' || e.region === filterValues.location
          );
        }
      })
      .filter(
        (e) =>
          filterValues.typeOfEvent === null ||
          filterValues.typeOfEvent === 'All' ||
          (Array.isArray(e.labels)
            ? e.labels.includes(`tag-${filterValues.typeOfEvent}`)
            : e.tags.map((t) => t.title.toLowerCase()).includes(`${filterValues.typeOfEvent.toLowerCase()}`))
      )
      .filter(
        (e) =>
          filterValues.description === null ||
          e.title.toLowerCase().includes(filterValues.description.toLowerCase()) ||
          e.introduction.toLowerCase().includes(filterValues.description.toLowerCase())
      );

    setFilteredEvents(filteredEvents);
  }, [filterValues, mergedEvents]);

  useEffect(() => {
    const handleWindowResize = () => {
      const htmlElement = document.documentElement;

      if (mobileShowMap && window.innerWidth < 992) {
        htmlElement.style.overflow = 'hidden';
      } else {
        htmlElement.style.overflow = '';
      }
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileShowMap]);

  return (
    <Layout bgColor="secondary-bg" extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />
      <EventLayout events={mergedEvents} />
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

export const PageQuery = graphql`
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
