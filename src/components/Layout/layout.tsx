import React, { useEffect, useState, ReactNode } from 'react';
import { Slice } from 'gatsby';
import Header from './header';

import '../../styles/main.scss';

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
    <>
      <Header setNavOpen={setNavOpen} heroBgColor={heroBgColor} />

      <div className="nav-open-overlay" />
      <main id={bgColor || ''} className={`main-content ${extraClassNames || ''}`}>
        {children}
      </main>

      <Slice alias="footer" />
    </>
  );
};

export default Layout;
