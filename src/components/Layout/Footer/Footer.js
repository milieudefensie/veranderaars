import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Link from '../../Global/Link/Link';
import { ReactSVG } from 'react-svg';
import wpIcon from '../../Icons/wp-icon.svg';
import Cta from '../../Global/Cta/Cta';

import './index.scss';

function Footer({ isLanding = false, customLogo = null }) {
  const data = useStaticQuery(graphql`
    query FooterData {
      configuration: datoCmsSiteConfiguration {
        whatsappGroup
      }
      datoCmsFooter {
        id
        logo {
          url
          width
          height
          alt
        }
        socialLinks {
          ... on DatoCmsSocialLink {
            id
            url
            socialNetwork
          }
        }
        columns {
          ... on DatoCmsMenuColumn {
            id
            label
            content
          }
        }
        bottomLinks {
          ... on DatoCmsGlobalLink {
            id
            label
            externalUrl
            content {
              ... on DatoCmsListTool {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsBasicPage {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsEvent {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsListEvent {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsListGroup {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsTool {
                id
                slug
                model {
                  apiKey
                }
              }
              ... on DatoCmsGroup {
                id
                slug
                model {
                  apiKey
                }
              }
            }
          }
        }
      }
    }
  `);

  const { logo = null, columns = [], bottomLinks = [] } = data.datoCmsFooter;
  const hasColumnsLinks = columns && columns.length > 0;

  return (
    <div className={`footer-container ${isLanding ? 'landing' : ''}`}>
      <div className="container">
        {/* First row */}
        <div className="first-row">
          <div>
            <Link to={'/'}>
              <img className="logo" src={isLanding ? customLogo?.url : logo?.url} alt={logo.alt} />
            </Link>
          </div>

          {data.configuration?.whatsappGroup && (
            <a
              className="wp-button"
              href={`${data.configuration.whatsappGroup}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="wp-btn">
                <span>WhatsApp groep</span>
                <ReactSVG src={wpIcon} />
              </div>
            </a>
          )}
        </div>

        {/* Second row */}
        <div className="row">
          {/* Columns links items */}
          {hasColumnsLinks &&
            columns.map((column) => (
              <div key={column.id} className="col-lg-3 col-6 columns-links">
                <h2>{column.label}</h2>
                <div className="content" dangerouslySetInnerHTML={{ __html: column.content }} />
              </div>
            ))}

          <div className="col extra-data">
            <Cta url="https://milieudefensie.nl/" externalTitle="milieudefensie.nl" customVariant="green" />

            {/* Extra links */}
            <div className="extra-links">
              {bottomLinks.map((link) => (
                <Link key={link.id} to={link}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="extra-text">
              <span>Milieudefensie is onderdeel van Friends of the Earth International</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
