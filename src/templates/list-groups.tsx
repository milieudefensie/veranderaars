import React, { useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import Map from '../components/Global/Map/map';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import ListGroupBlock from '../components/Blocks/HighlightGroup/list-groups';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import FloatCta from '../components/Global/FloatCta/float-cta';
import type { ListGroupTemplate } from '../types';

import './list-basic.styles.scss';

type ListGroupsProps = PageProps<ListGroupTemplate>;

const ListGroups: React.FC<ListGroupsProps> = ({ data: { page, allGroups = { edges: [] }, favicon } }) => {
  const { seo, title, content } = page;
  const mappedGroups = Array.isArray(allGroups.edges) ? allGroups.edges.map((raw) => raw.node) : [];

  const [mobileShowMap, setMobileShowMap] = useState(false);

  useEffect(() => {
    const ctaView = document.querySelector('#cta-view-list');

    const handleScroll = () => {
      if (!ctaView) return;

      // Hide float container on footer
      const testElement = document.getElementById('groups-list');
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const testElementPosition = testElement?.offsetTop;

      if (!testElement || !scrollPosition || !testElementPosition) return;

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

            <Map
              type="group"
              title={title}
              data={mappedGroups}
              mobileView={mobileShowMap}
              setMobileView={setMobileShowMap}
              extraLogic={() => {
                if (!mobileShowMap) setMobileShowMap((prev) => !prev);
              }}
            />

            {Array.isArray(mappedGroups) && <ListGroupBlock items={mappedGroups} />}

            <FloatCta title="Bekijk lijst" id="groups-list" />
          </div>

          {content && (
            <div className="container mt-5 pb-5">
              <StructuredTextDefault content={content} />
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
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
