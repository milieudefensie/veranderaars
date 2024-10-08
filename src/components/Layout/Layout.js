import React, { useEffect, useState } from 'react';
import { Slice } from 'gatsby';
import Header from './Header';

import '../../styles/main.scss';

function Layout({ children, bgColor = null, extraClassNames = null, heroBgColor = 'default' }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const trackingTally = document.createElement('script');
    trackingTally.src = 'https://tally.so/widgets/embed.js';
    trackingTally.async = true;
    document.body.appendChild(trackingTally);

    const tallyConfig = document.createElement('script');
    tallyConfig.innerHTML = `
      window.TallyConfig = {
        "formId": "mZaLJA",
        "popup": {
          "width": 250,
          "open": {
            "trigger": "scroll",
            "scrollPercent": 80
          },
          "hideTitle": true,
          "showOnce": true
        }
      };
    `;
    document.body.appendChild(tallyConfig);

    return () => {
      document.body.removeChild(trackingTally);
      document.body.removeChild(tallyConfig);
    };
  }, []);

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
      {/* slice does not work here, because of setNavOpen function and serializable issue */}
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
