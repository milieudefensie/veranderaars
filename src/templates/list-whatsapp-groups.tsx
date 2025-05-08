import React, { useEffect, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import Map from '../components/Global/Map/Map';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import ListGroupBlock from '../components/Blocks/HighlightGroup/list-groups';
import Blocks from '../components/blocks';
import FloatCta from '../components/Global/FloatCta/float-cta';
import type { ListWhatsappGroupsTemplate } from '../types';

import './list-basic.styles.scss';

const ListWhatsAppGroups: React.FC<PageProps<ListWhatsappGroupsTemplate>> = ({ data }) => {
  const { seo, title, blocks = [] } = data.page;
  const mappedGroups = Array.isArray(data.allGroups.edges) ? data.allGroups.edges.map((raw) => raw.node) : [];
  const [mobileShowMap, setMobileShowMap] = useState(false);

  useEffect(() => {
    const ctaView = document.querySelector('#cta-view-list');

    const handleScroll = () => {
      const testElement = document.getElementById('groups-list');
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const testElementPosition = testElement?.offsetTop ?? Infinity;

      if (scrollPosition + 700 < testElementPosition) {
        ctaView?.classList.remove('hide');
      } else {
        ctaView?.classList.add('hide');
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
      <SeoDatoCMS seo={seo} favicon={data.favicon} />

      <WrapperLayout variant="white">
        <HeroBasic backgroundColor="light" responsiveVariant="event" />

        <div className="list-event-wrapper">
          <div className="container">
            <h1 className="main-heading">{title}</h1>

            <Map
              type="wp-group"
              title={title}
              data={mappedGroups}
              mobileView={mobileShowMap}
              setMobileView={setMobileShowMap}
              extraLogic={() => {
                if (!mobileShowMap) setMobileShowMap((prev) => !prev);
              }}
            />

            {Array.isArray(mappedGroups) && <ListGroupBlock items={mappedGroups} redirectToWhatsappGroup={true} />}

            <FloatCta title="Bekijk lijst" id="groups-list" variant="wp-group" />
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

export default ListWhatsAppGroups;

export const PageQuery = graphql`
  query ListGroupById($id: String, $language: String!) {
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
    allGroups: allDatoCmsGroup(sort: { title: ASC }, filter: { whatsappGroup: { ne: "" } }) {
      edges {
        node {
          id
          title
          whatsappGroup
          coordinates {
            latitude
            longitude
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
    page: datoCmsListGroupWhatsappCommunity(id: { eq: $id }) {
      id
      title
      slug
      blocks {
        ... on DatoCmsMap {
          ...BlockMap
        }
        ... on DatoCmsColumn {
          ...BlockColumns
        }
        ... on DatoCmsCountdown {
          ...BlockCountdown
        }
        ... on DatoCmsCtaList {
          ...BlockCtaList
        }
        ... on DatoCmsCtaIconsList {
          ...BlockCtaIconsList
        }
        ... on DatoCmsImageGallery {
          ...BlockImageGallery
        }
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
        ... on DatoCmsMap {
          ...BlockMap
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
