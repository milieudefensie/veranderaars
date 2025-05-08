import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import { HelmetDatoCms } from 'gatsby-source-datocms';

type NotFoundPageData = {
  favicon: { faviconMetaTags: { tags: any } };
};

const pageStyles: React.CSSProperties = {
  color: '#232129',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const headingStyles: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const paragraphStyles: React.CSSProperties = {
  marginBottom: 48,
};

const NotFoundPage: React.FC<PageProps<NotFoundPageData>> = ({ data }) => {
  return (
    <main style={pageStyles}>
      <HelmetDatoCms seo={data.favicon.faviconMetaTags}>
        <title>Deze pagina bestaat niet</title>
      </HelmetDatoCms>

      <h1 style={headingStyles}>Deze pagina bestaat niet</h1>
      <p style={paragraphStyles}>
        Klimaatverandering helaas wel.
        <br />
        <br />
        <Link to="/">Terug naar hoofdpagina</Link>.
      </p>
    </main>
  );
};

export default NotFoundPage;

export const NotFoundQuery = graphql`
  query NotFound {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
  }
`;
