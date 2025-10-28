import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Nav from '../Global/Nav/nav';

const Header: React.FC = () => {
  const menus = useStaticQuery(graphql`
    query {
      mainMenu: datoCmsNavigation {
        mainLinks {
          ...MainNavigation
        }
        sidebarLinks {
          ...MainNavigation
        }
        sidebarButtons {
          ...MainNavigation
        }
        sidebarExtraLinks {
          ...MainNavigation
        }
      }
    }
  `);

  return (
    <header data-datocms-noindex>
      <Nav items={menus.mainMenu} />
    </header>
  );
};

export default Header;
