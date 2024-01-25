import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer/Footer';

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
          "width": 300,
          "hideTitle": true,
          "open": {
            "trigger": "scroll",
            "scrollPercent": 50
          }
        }
      };
    `;
    document.body.appendChild(tallyConfig);

    return () => {
      document.body.removeChild(trackingTally);
      document.body.removeChild(tallyConfig);
    };
  }, []);

  return (
    <>
      <Header setNavOpen={setNavOpen} heroBgColor={heroBgColor} />
      <main id={`${bgColor ? bgColor : ''}`} className={`main-content ${extraClassNames ? extraClassNames : ''}`}>
        {navOpen && <div className="nav-open-overlay"></div>}

        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
