import React, { useEffect, useState } from 'react';
import { Slice } from 'gatsby';
import Header from './Header';
import { Tolgee, DevTools, TolgeeProvider, FormatSimple, BackendFetch } from '@tolgee/react';
import Spinner from '../Global/Spinner/Spinner';

import '../../styles/main.scss';

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(
    BackendFetch({
      prefix: 'https://cdn.tolg.ee/bf0c713a0235c5dcaeb14c9d6081e18d', //process.env.GATSBY_APP_TOLGEE_CDN_URL
    })
  )
  .init({
    language: 'nl',
    apiUrl: 'https://app.tolgee.io', //process.env.GATSBY_APP_TOLGEE_API_URL,
    apiKey: 'tgpak_ge3tambtl5zwqmldhb3g6z3smq3w2mdkovwdmn3sorqws2tnorrq', // process.env.GATSBY_APP_TOLGEE_API_KEY,
    staticData: {
      en: () => import(`../../../locales/en.json`),
      nl: () => import('../../../locales/nl.json'),
    },
  });

function Layout({ children, bgColor = null, extraClassNames = null, heroBgColor = 'default' }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const overlay = document.querySelector('.nav-open-overlay');
    if (!overlay) return;

    if (!navOpen) {
      overlay.style.opacity = 0;
      setTimeout(() => {
        overlay.style.zIndex = -1;
      }, 750);
    } else {
      overlay.style.opacity = 1;
      overlay.style.zIndex = 15;
    }
  }, [navOpen]);

  return (
    <TolgeeProvider
      tolgee={tolgee}
      loadingFallback={
        <div className="full-screen-loader">
          <Spinner />
        </div>
      }
    >
      <Header alias="header" setNavOpen={setNavOpen} heroBgColor={heroBgColor} />
      <div className={`nav-open-overlay`} />

      <main id={`${bgColor ? bgColor : ''}`} className={`main-content ${extraClassNames ? extraClassNames : ''}`}>
        {children}
      </main>

      <Slice alias="footer" />
    </TolgeeProvider>
  );
}

export default Layout;
