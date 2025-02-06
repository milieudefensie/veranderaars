import React, { useEffect, useState } from 'react';
import { Slice } from 'gatsby';
import Header from './Header';

import '../../styles/main.scss';

function Layout({ children, bgColor = null, extraClassNames = null, heroBgColor = 'default' }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const overlay = document.querySelector('.nav-open-overlay');
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
    <>
      <Header alias="header" setNavOpen={setNavOpen} heroBgColor={heroBgColor} />

      <div className={`nav-open-overlay`} />
      <main id={`${bgColor ? bgColor : ''}`} className={`main-content ${extraClassNames ? extraClassNames : ''}`}>
        {children}
      </main>

      <Slice alias="footer" />
    </>
  );
}

export default Layout;
