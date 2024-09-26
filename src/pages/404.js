import * as React from 'react';
import { Link, graphql } from 'gatsby';
import SeoDatoCMS from '../components/Layout/SeoDatocms';

const pageStyles = {
  color: '#232129',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const paragraphStyles = {
  marginBottom: 48,
};

const NotFoundPage = ({ data: { favicon } }) => {
  return (
    <main style={pageStyles}>
      <SeoDatoCMS favicon={favicon}>
        <title>Deze pagina bestaat niet</title>
      </SeoDatoCMS>

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
