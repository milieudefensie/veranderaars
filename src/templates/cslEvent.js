import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/Layout';
import SeoDatoCMS from '../components/Layout/SeoDatocms';
import WrapperLayout from '../components/Layout/WrapperLayout/WrapperLayout';
import HeroBasic from '../components/Global/HeroBasic/HeroBasic';
import FloatLayout from '../components/Global/FloatLayout/FloatLayout';
import backBtnIcon from '../components/Icons/back-btn.svg';
import Link from '../components/Global/Link/Link';
import { ReactSVG } from 'react-svg';
import { formatDate, formatDateCSL } from '../utils';
import dateIcon from '../components/Icons/calendar-date.svg';
import hourIcon from '../components/Icons/calendar-hour.svg';
import locationIcon from '../components/Icons/calendar-location.svg';
import wpIcon from '../components/Icons/wp-icon.svg';
import Form from '../components/Global/Form/Form';

import './basic.styles.scss';

const CSLEvent = ({ pageContext, data: { page, listEvent, favicon } }) => {
  const {
    title,
    slug,
    image_url,
    additional_image_sizes_url,
    description,
    raw_end,
    start_in_zone,
    end_in_zone,
    location,
    inputs = [],
    hiddenAddress = false,
  } = page;
  const heroImage = pageContext?.heroImage?.url || image_url;

  const [shareWpText, setShareWpText] = useState('');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    // Share WP
    const currentURL = encodeURIComponent(window.location.href);
    setShareWpText(`https://wa.me/?text=${currentURL}`);
  }, []);

  let mainImage = null;
  if (additional_image_sizes_url) {
    mainImage = additional_image_sizes_url.find((i) => i.style === 'original');
  }

  return (
    <Layout>
      <SeoDatoCMS favicon={favicon}>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image_url || ''} />
        <meta property="og:site_name" content="Milieudefensie" />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image_url || ''} />
        <meta name="twitter:card" content="summary_large_image" />
      </SeoDatoCMS>

      <WrapperLayout variant="white">
        <HeroBasic image={{ url: heroImage }} overlay={false} external />

        <FloatLayout reduceOverlap>
          {listEvent && (
            <div className="pre-header">
              <div className="back-btn">
                <Link to={listEvent}>
                  <img src={backBtnIcon} alt="Back button icon" />
                  <span>Alle evenementen</span>
                </Link>
              </div>
            </div>
          )}

          {title && <h1>{title}</h1>}

          {/* Form  */}
          <div className={`form-wrapper`}>
            <Form event={slug} inputs={inputs} />
          </div>

          {/* Brief information */}
          <div className="brief-information">
            <div className="metadata">
              {start_in_zone && (
                <span>
                  <img src={dateIcon} alt="Date icon" />
                  <span>{formatDate(start_in_zone)}</span>
                </span>
              )}

              {start_in_zone && (
                <span>
                  <img src={hourIcon} alt="Hour icon" />
                  <span>
                    {start_in_zone ? formatDateCSL(start_in_zone) : ''}{' '}
                    {raw_end ? ` - ${formatDateCSL(end_in_zone)}` : ''}
                  </span>
                </span>
              )}

              {!hiddenAddress && location && (
                <span>
                  <img src={locationIcon} alt="Location icon" />
                  <span>{location.venue}</span>
                </span>
              )}
            </div>

            {shareWpText && (
              <a className="wp-button" href={shareWpText} target="_blank" rel="noopener noreferrer">
                <span>Deel op WhatsApp</span>
                <ReactSVG src={wpIcon} alt="Wp icon" />
              </a>
            )}
          </div>

          {mainImage?.url && (
            <div className="image-event">
              <img src={mainImage.url} alt={title} />
            </div>
          )}

          {description && (
            <div className="content" style={{ whiteSpace: 'break-spaces' }}>
              <p dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}
        </FloatLayout>
      </WrapperLayout>
    </Layout>
  );
};

export default CSLEvent;

export const PageQuery = graphql`
  query CslEventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
    page: externalEvent(id: { eq: $id }) {
      __typename
      id
      slug
      title
      url
      description
      raw_start
      raw_end
      start_at
      end_at
      start_in_zone
      end_in_zone
      time_zone
      virtual
      launched_at
      locale
      image_url
      hiddenAddress
      location {
        latitude
        longitude
        postal_code
        country
        region
        locality
        query
        street
        street_number
        venue
      }
      labels
      inputs
    }
  }
`;
