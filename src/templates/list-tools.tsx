import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import HeroBasic from '../components/Global/HeroBasic/hero-basic';
import SimpleText from '../components/Blocks/SimpleText/simple-text';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout';
import FloatLayout from '../components/Global/FloatLayout/float-layout';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import type { ListToolsTemplate } from '../types';

const ListTool: React.FC<PageProps<ListToolsTemplate>> = ({ data }) => {
  const { seo, title, introduction, backgroundColor, heroBackgroundImage, content } = data.page;

  return (
    <Layout heroBgColor={backgroundColor || undefined}>
      <SeoDatoCMS seo={seo} favicon={data.favicon} />

      <WrapperLayout variant="white">
        <HeroBasic
          image={heroBackgroundImage || undefined}
          backgroundColor={backgroundColor || undefined}
          responsiveVariant="tools"
          overlay={false}
        />

        <FloatLayout reduceOverlap>
          <h1 className="main-heading">{title}</h1>
          {introduction && <SimpleText limitedWidth block={{ text: introduction }} extraClassNames="single" />}
          {content && <StructuredTextDefault content={content} />}
        </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default ListTool;

export const PageQuery = graphql`
  query ListToolById($id: String, $language: String!) {
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
    page: datoCmsListTool(id: { eq: $id }) {
      title
      introduction
      backgroundColor
      heroBackgroundImage {
        url
        gatsbyImageData
      }
      seo: seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
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
    }
  }
`;
