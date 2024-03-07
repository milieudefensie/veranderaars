import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import EventCard from '../components/Blocks/HighlightEvent/EventCard';
import Map from '../components/Global/Map/Map';
import FilterEvents from '../components/Global/FilterEvents/FilterEvents';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import Spinner from '../components/Global/Spinner/Spinner';
import CtaHandler from '../components/Global/Cta/CtaHandler';
import Blocks from '../components/Blocks';
import FloatCta from '../components/Global/FloatCta/FloatCta';
import useCSLEvents from '../hooks/useCSLEvents';

import './list-basic.styles.scss';

const ListEvents = ({ pageContext, data: { page, allEvents = [], favicon } }) => {
  const { title, seo, highlighEvent, blocks = [] } = page;
  const cmsEvents = Array.isArray(allEvents.edges)
    ? allEvents.edges.map((raw) => ({
        ...raw.node,
        coordinates: {
          latitude: parseFloat(raw.node.coordinates?.latitude?.toFixed(6)),
          longitude: parseFloat(raw.node.coordinates?.longitude?.toFixed(6)),
        },
        type: 'NATIONAL',
      }))
    : [];

  const [filterValues, setFilterValues] = useState({ location: null, typeOfEvent: null, description: null });
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  const { mergedEvents, setFilteredEvents, filteredEvents, locationOptions, status } = useCSLEvents(cmsEvents);

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
          (Array.isArray(e.labels) && e.labels.includes(`tag-${filterValues.typeOfEvent}`))
      )
      .filter((e) => filterValues.description === null || e.introduction.includes(filterValues.description));

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

  const isLoading = status === 'loading';

  return (
    <Layout bgColor="secondary-bg" extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white" responsiveVariant="secondary-bg">
        <HeroBasic backgroundColor="light" responsiveVariant="event" />

        <div className="list-event-wrapper">
          <div className="container">
            {title && <h1>{title}</h1>}

            {/* Mobile button */}
            {!isLoading && (
              <div className="mobile-view-map mb-4">
                <CtaHandler
                  title={'Map View'}
                  isPrimaryButton
                  handleOnClick={() => setMobileShowMap((prev) => !prev)}
                />
              </div>
            )}

            {highlighEvent && (
              <div className="highlighted-event-wrapper">
                <EventCard event={highlighEvent} isHighlighted />
              </div>
            )}

            <div className={`${mobileShowMap ? 'mobile-map' : ''}`}>
              <Map title={title} data={filteredEvents} mobileView={mobileShowMap} setMobileView={setMobileShowMap} />

              {isLoading ? (
                <div style={{ textAlign: 'center' }}>
                  <Spinner />
                </div>
              ) : (
                <>
                  <FilterEvents
                    events={filteredEvents}
                    locations={locationOptions}
                    handleOnApplyNewFilters={(newFilterValues) =>
                      setFilterValues((prev) => ({ ...prev, ...newFilterValues }))
                    }
                  />

                  <FloatCta title="Bekijk lijst" id="filter-events-list" isArrowVisible={isArrowVisible} />
                </>
              )}
            </div>
          </div>

          {Array.isArray(blocks) && blocks.length > 0 && (
            <div className="mt-5 pb-5">
              <Blocks blocks={blocks} />
            </div>
          )}
        </div>
      </WrapperLayout>
    </Layout>
  );
};

export default ListEvents;

export const PageQuery = graphql`
  query ListEventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    allEvents: allDatoCmsEvent {
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
    page: datoCmsListEvent(id: { eq: $id }) {
      id
      title
      slug
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
      blocks {
        ... on DatoCmsNarrativeBlock {
          ...BlockNarrativeBlock
        }
        ... on DatoCmsHighlightEvent {
          ...BlockHighlightEvent
        }
        ... on DatoCmsHighlightTool {
          ...BlockHighlightTools
        }
        ... on DatoCmsTextHubspotForm {
          ...BlockTextHubspot
        }
        ... on DatoCmsTable {
          ...BlockTable
        }
        ... on DatoCmsShare {
          ...BlockShare
        }
        ... on DatoCmsImage {
          ...BlockImage
        }
        ... on DatoCmsEmbedIframe {
          ...BlockEmbedIframe
        }
        ... on DatoCmsAcordion {
          ...BlockAccordion
        }
        ... on DatoCmsVideoBlock {
          ...BlockVideo
        }
        ... on DatoCmsSimpleText {
          ...BlockText
        }
        ... on DatoCmsCta {
          ...BlockCta
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
