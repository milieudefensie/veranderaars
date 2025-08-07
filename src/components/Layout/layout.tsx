import React, { useEffect, useState, ReactNode } from 'react';
import { Slice } from 'gatsby';
import Header from './header';
import { Tolgee, DevTools, TolgeeProvider, FormatSimple, BackendFetch } from '@tolgee/react';
import Spinner from '../Global/Spinner/spinner';

import '../../styles/main.scss';

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(BackendFetch({ prefix: process.env.GATSBY_APP_TOLGEE_CDN_URL }))
  .init({
    language: 'nl',
    apiUrl: process.env.GATSBY_APP_TOLGEE_API_URL,
    apiKey: process.env.GATSBY_APP_TOLGEE_API_KEY,
    staticData: {
      en: () => import(`../../../locales/en.json`),
      nl: () => import('../../../locales/nl.json'),
    },
  });

interface LayoutProps {
  children: ReactNode;
  bgColor?: string | null;
  extraClassNames?: string | null;
  heroBgColor?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  bgColor = null,
  extraClassNames = null,
  heroBgColor = 'default',
}) => {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const overlay = document.querySelector('.nav-open-overlay') as HTMLElement | null;

    if (!overlay) return;

    if (!navOpen) {
      overlay.style.opacity = '0';

      setTimeout(() => {
        if (overlay) overlay.style.zIndex = '-1';
      }, 750);
    } else {
      overlay.style.opacity = '1';
      overlay.style.zIndex = '15';
    }
  }, [navOpen]);

  return (
    <TolgeeProvider
      tolgee={tolgee}
      ssr={{
        language: 'nl',
        staticData: {
          en: () => import(`../../../locales/en.json`),
          nl: () => import('../../../locales/nl.json'),
        },
      }}
      fallback={
        <div className="full-screen-loader">
          <Spinner />
        </div>
      }
    >
      <Header setNavOpen={setNavOpen} heroBgColor={heroBgColor} />
      <div className={`nav-open-overlay`} />

      <main id={`${bgColor ? bgColor : ''}`} className={`main-content ${extraClassNames ? extraClassNames : ''}`}>
        {children}
      </main>

      <Slice alias="footer" />
    </TolgeeProvider>
  );
};

export default Layout;
