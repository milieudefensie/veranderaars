import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Nav from '../Global/Nav/nav';

interface HeaderProps {
  setNavOpen: (open: boolean) => void;
  heroBgColor?: string;
}

interface MenuItem {
  id: string;
  label: string;
  link: {
    slug: string;
    __typename: string;
  };
  [key: string]: any;
}

interface Configuration {
  whatsappGroup?: string;
  whatsappPage?: {
    id: string;
    slug: string;
    model: {
      apiKey: string;
    };
    __typename: string;
  } | null;
}

interface StaticQueryData {
  mainMenu: { nodes: MenuItem[] };
  configuration: Configuration;
}

const Header: React.FC<HeaderProps> = ({ setNavOpen, heroBgColor }) => {
  const menus = useStaticQuery<StaticQueryData>(graphql`
    query {
      mainMenu: allDatoCmsMenuItem(filter: { root: { eq: true } }, sort: { position: ASC }) {
        nodes {
          ...MainNavigation
        }
      }
      configuration: datoCmsSiteConfiguration {
        whatsappGroup
        whatsappPage {
          __typename
          ... on DatoCmsBasicPage {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListGroupWhatsappCommunity {
            id
            slug
            model {
              apiKey
            }
          }
        }
      }
    }
  `);

  return (
    <header data-datocms-noindex>
      <Nav navData={menus.mainMenu} config={menus.configuration} setNavOpen={setNavOpen} heroBgColor={heroBgColor} />
    </header>
  );
};

export default Header;
