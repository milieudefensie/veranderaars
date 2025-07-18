import React, { useEffect, useRef, useState } from 'react';
import Link from '../Link/link';
import { ReactSVG } from 'react-svg';
import Cta from '../Cta/cta';
// @ts-expect-error
import hamburgerIcon from '../../Icons/Hamburguer Icon.svg'; // @ts-expect-error
import headerUpdatedLogo from '../../Icons/md-new-logo.svg'; // @ts-expect-error
import signalNavigationIcon from '../../Icons/signal.svg';

import './index.scss';

interface LinkItemProps {
  link: string;
  label: string;
  isButton: boolean;
}

const LinkItem = ({ link, label, isButton }: LinkItemProps) => {
  return (
    <li className="nav-item">
      <Link to={link} className={isButton ? 'btn btn-primary' : ''}>
        {label}
      </Link>
    </li>
  );
};

interface DropdownItemProps {
  link: string;
  label: string;
  children: Array<{ id: string; title: string; link: string }>;
}

const DropdownItem = ({ link, label, children }: DropdownItemProps) => {
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
              <Link className="dropdown-link" to={link.link}>
                {link?.title}
              </Link>
            </li>
          ))}
      </ul>
    </li>
  );
};

interface NavProps {
  navData: { nodes: Array<{ id: string; title: string; treeChildren: any[]; isButton: boolean; link: string }> };
  config: {
    whatsappPage?: string;
    whatsappGroup?: string;
  };
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heroBgColor: string;
}

export default function Nav({ navData, config, setNavOpen, heroBgColor }: NavProps) {
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
              <ReactSVG src={headerUpdatedLogo} alt="Milieudefensie logo" />
            </Link>

            <div className="actions">
              <button
                type="button"
                aria-label="Toggle navigation"
                className="navbar-toggler2"
                onClick={() => handleNavClick()}
                ref={openNavBtnRef}
              >
                <ReactSVG src={hamburgerIcon} />
              </button>

              {config.whatsappPage ? (
                <Link className="wp-button" to={config.whatsappPage}>
                  <ReactSVG src={signalNavigationIcon} />
                </Link>
              ) : config?.whatsappGroup ? (
                <a className="wp-button" href={`${config.whatsappGroup}`} target="_blank" rel="noopener noreferrer">
                  <ReactSVG src={signalNavigationIcon} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

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
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.83276 25.5L26.1673 2.16548"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {config.whatsappPage ? (
                <Link className="wp-button" to={config.whatsappPage}>
                  <ReactSVG src={signalNavigationIcon} />
                </Link>
              ) : config?.whatsappGroup ? (
                <a className="wp-button" href={`${config.whatsappGroup}`} target="_blank" rel="noopener noreferrer">
                  <ReactSVG src={signalNavigationIcon} />
                </a>
              ) : null}
            </div>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <div className="links-container">
                {groupedLinks.links.map((link) =>
                  link.treeChildren.length === 0 ? (
                    <LinkItem key={link.id} link={link} label={link.title} isButton={link.isButton} />
                  ) : (
                    <DropdownItem key={link.id} link={link} label={link.title} children={link.treeChildren} />
                  )
                )}
              </div>

              <Cta url="https://milieudefensie.nl/" externalTitle="milieudefensie.nl" isButton />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
