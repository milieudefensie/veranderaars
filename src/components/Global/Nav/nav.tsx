import React, { useEffect, useRef, useState } from 'react';
import Link from '../Link/link'; // @ts-expect-error
import headerUpdatedLogo from '../../Icons/md-new-logo.svg';

import './index.scss';

const MobileNavbar = ({
  items,
}: {
  items: { mainLinks: any[]; sidebarLinks: any[]; sidebarButtons: any[]; sidebarExtraLinks: any[] };
}) => {
  const menuRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Navigation desktop */}
      <div id="header-mobile-wrapper" className={isScrolled ? 'scrolled' : ''}>
        <header id="header-mobile" className={`container header-mobile-${isMobileMenuOpen ? 'open' : 'closed'}`}>
          {/* Mobile Header - Closed State */}
          <div className={`MobileHeader MobileHeader-closed ${isMobileMenuOpen ? 'hidden' : ''}`}>
            <Link className="Header-logo-link Header-logo-link-mobile" to="https://milieudefensie.nl/">
              <img src={headerUpdatedLogo} alt="Logo Milieudefensie" className="Header-logo" />
            </Link>
            <div className="MobileHeader-menuContainer">
              {items.mainLinks.map((link) => (
                <Link key={link.id} to={link} className={`button small ${link.variant}`} target="_self">
                  {link.title}
                </Link>
              ))}
              <a
                href="#"
                className="button small black"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMobileMenu();
                }}
              >
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M4 18L20 18" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                    <path d="M4 12L20 12" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                    <path d="M4 6L20 6" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </span>
                <span className="hideOnSmallDevices">Menu</span>
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* Navigation Mobile */}
      <div ref={menuRef} className="NavigationMobile" style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
        <div className={`MobileHeader MobileHeader-open ${!isMobileMenuOpen ? 'hidden' : ''}`}>
          <Link className="Header-logo-link Header-logo-link-desktop" to="https://milieudefensie.nl/">
            <img src={headerUpdatedLogo} alt="Logo Milieudefensie" className="Header-logo" />
          </Link>

          <a
            href="#"
            className="MobileHeader-menu"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="#0F1729"
              />
            </svg>
          </a>
        </div>

        <div className="NavigationMobile-nav">
          <ul className="NavigationMobile-main">
            {items.sidebarLinks.map((link) => (
              <li key={link.id} className="NavigationMobile-mainItem">
                <Link to={link} className="NavigationMobile-mainItemLink" target="_self">
                  {link.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    height="16px"
                    width="16px"
                    version="1.1"
                    id="Layer_1"
                    viewBox="0 0 511.949 511.949"
                  >
                    <g>
                      <g>
                        <path d="M386.235,248.308L140.902,2.975c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827l237.76,237.76    l-237.76,237.867c-4.267,4.053-4.373,10.88-0.213,15.04c4.053,4.267,10.88,4.373,15.04,0.213c0.107-0.107,0.213-0.213,0.213-0.213    l245.333-245.333C390.395,259.188,390.395,252.468,386.235,248.308z" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="NavigationMobile-buttons">
            <div className="ButtonsContainer">
              {items.sidebarButtons.map((link) => (
                <Link key={link.id} to={link} className={`button with-width ${link.variant}`} target="_self">
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="NavigationMobile-links">
            <div className="LinksContainer">
              {items.sidebarExtraLinks.map((link) => (
                <Link key={link.id} to={link} target="_self">
                  {link.icon === 'search' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                        stroke="#000000"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`nav-open-overlay ${isMobileMenuOpen ? 'active' : ''}`}></div>
    </>
  );
};

export default MobileNavbar;
