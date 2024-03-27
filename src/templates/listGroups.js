import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import Map from '../components/Global/Map/Map';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import ListGroupBlock from '../components/Blocks/HighlightGroup/ListGroups';
import Blocks from '../components/Blocks';
import FloatCta from '../components/Global/FloatCta/FloatCta';

import './list-basic.styles.scss';

const ListGroups = ({ pageContext, data: { page, allGroups = [], favicon } }) => {
  const { seo, title, blocks = [] } = page;
  const mappedGroups = Array.isArray(allGroups.edges) ? allGroups.edges.map((raw) => raw.node) : [];
  const [mobileShowMap, setMobileShowMap] = useState(false);

  useEffect(() => {
    const ctaView = document.querySelector('#cta-view-list');

    const handleScroll = () => {
      // Hide float container on footer
      const testElement = document.getElementById('groups-list');
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const testElementPosition = testElement?.offsetTop;

      if (scrollPosition + 700 < testElementPosition) {
        ctaView.classList.remove('hide');
      } else {
        ctaView.classList.add('hide');
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <Layout extraClassNames="list-pages">
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant="white">
        <HeroBasic backgroundColor="light" responsiveVariant="event" />

        <div className="list-event-wrapper">
          <div className="container">
            <h1>{title}</h1>

            {/* Map */}
            <Map
              title={title}
              data={mappedGroups}
              type="group"
              mobileView={mobileShowMap}
              setMobileView={setMobileShowMap}
              extraLogic={() => {
                if (!mobileShowMap) setMobileShowMap((prev) => !prev);
              }}
            />

            {Array.isArray(mappedGroups) && <ListGroupBlock items={mappedGroups} withContainer={false} />}

            {/* Fixed cta to view all */}
            <FloatCta title="Bekijk lijst" id="groups-list" />
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

export default ListGroups;

export const PageQuery = graphql`
  query ListGroupById($id: String) {
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
          address
          coordinates {
            latitude
            longitude
          }
          model {
            apiKey
          }
          image {
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
    page: datoCmsListGroup(id: { eq: $id }) {
      id
      title
      slug
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
        ... on DatoCmsBlockCta {
          ...BlockCustomCta
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
