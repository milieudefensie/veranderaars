import React, { useEffect, useRef, useState } from 'react';
import Link from '../Link/Link';
import headerLogo from '../../Icons/Logo Component.svg';
import { ReactSVG } from 'react-svg';
import hamburgerIcon from '../../Icons/Hamburguer Icon.svg';
import wpNavigationIcon from '../../Icons/Whatsapp Navigation.svg';
import Cta from '../Cta/Cta';

import './index.scss';

const LinkItem = ({ link, label, isButton }) => {
  return (
    <li className="nav-item">
      <Link to={link} className={isButton ? 'btn btn-primary' : ''}>
        {label}
      </Link>
    </li>
  );
};

const DropdownItem = ({ link, label, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLinkClick = () => setDropdownOpen((prev) => !prev);

  return (
    <li className={`dropdown nav-item ${dropdownOpen ? 'open' : ''}`}>
      <Link to={link} onClick={handleLinkClick} style={{ cursor: 'pointer' }}>
        {label}
      </Link>

      <ul className={`dropdown-menu ${dropdownOpen ? 'open' : null}`}>
        {children
          ?.sort((a, b) => a.position - b.position)
          .map((link) => (
            <li className="dropdown-item" key={link.id}>
              <Link className="dropdown-link" to={link}>
                {link?.title}
              </Link>
            </li>
          ))}
      </ul>
    </li>
  );
};

export default function Nav({ navData, config, setNavOpen, heroBgColor }) {
  const navRef = useRef(null);
  const openNavBtnRef = useRef(null);

  const navLinks = navData.nodes;
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openNavBtnRef.current && openNavBtnRef.current.contains(event.target)) {
        setExpanded((prev) => !prev);
        return;
      }

      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    const handleBtnClick = () => {
      setExpanded((prev) => !prev);
    };

    document.addEventListener('click', handleClickOutside);

    if (openNavBtnRef.current) {
      openNavBtnRef.current.addEventListener('click', handleBtnClick);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);

      if (openNavBtnRef.current) {
        openNavBtnRef.current.removeEventListener('click', handleBtnClick);
      }
    };
  }, [openNavBtnRef]);

  useEffect(() => {
    setNavOpen(expanded);
  }, [expanded]);

  const groupedLinks = navLinks.reduce(
    (result, item) => {
      if (item.isButton) {
        result.ctas.push(item);
      } else {
        result.links.push(item);
      }
      return result;
    },
    { ctas: [], links: [] }
  );

  return (
    <>
      <nav className={`navbar2 ${heroBgColor}`}>
        <div className="container">
          <div className="top-section">
            <Link className="navbar-brand" to={'/'}>
              <ReactSVG src={headerLogo} alt="Milieudefensie logo" />
            </Link>

            <div className="actions" style={{ visibility: !expanded ? 'visible' : 'hidden' }}>
              <button
                type="button"
                data-target="#navNav"
                aria-expanded="false"
                aria-controls="navNav"
                data-toggle="collapse"
                className="navbar-toggler"
                aria-label="Toggle navigation"
                onClick={() => handleNavClick()}
                ref={openNavBtnRef}
              >
                <ReactSVG src={hamburgerIcon} />
              </button>

              {config?.whatsappGroup && (
                <a className="wp-button" href={`${config.whatsappGroup}`} target="_blank" rel="noopener noreferrer">
                  <ReactSVG src={wpNavigationIcon} />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Open navbar */}
      <div id="nav-content">
        <div ref={navRef} className={`offcanvas offcanvas-end ${expanded ? 'show' : ''}`}>
          <div className="offcanvas-header">
            <div className="actions">
              <button
                className="close"
                type="button"
                aria-label="Toggle navigation"
                onClick={() => setExpanded((prev) => !prev)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                  <path
                    d="M2.83276 2.5L26.1673 25.8345"
                    stroke="#295F4E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.83276 25.5L26.1673 2.16548"
                    stroke="#295F4E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {config?.whatsappGroup && (
                <a className="wp-button" href={`${config.whatsappGroup}`} target="_blank" rel="noopener noreferrer">
                  <ReactSVG src={wpNavigationIcon} />
                </a>
              )}
            </div>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <div className="links-container">
                {groupedLinks.links.map((link) =>
                  link.treeChildren.length === 0 ? (
                    <LinkItem key={link.id} link={link} label={link?.title} isButton={link?.isButton} />
                  ) : (
                    <DropdownItem key={link.id} link={link} label={link?.title} children={link?.treeChildren} />
                  )
                )}
              </div>

              {/* Main btn */}
              <Cta url="https://milieudefensie.nl/" externalTitle="milieudefensie.nl" isButton />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
