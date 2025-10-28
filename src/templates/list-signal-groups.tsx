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

const ListSignalGroups: React.FC<any> = ({ data: { page, favicon } }) => {
  const { seo, title, introduction, content } = page;

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

        <div className="container negative-margin">asdasdas</div>
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
    allGroups: allDatoCmsGroup(sort: { title: ASC }) {
      edges {
        node {
          id
          title
          slug
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
        }
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
