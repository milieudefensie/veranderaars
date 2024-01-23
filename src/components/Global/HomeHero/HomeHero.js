import React from 'react';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './index.scss';

function HomeHero({ title, subtitle, image, form = null, mobileImage = null }) {
  const bgImageUrl = image?.gatsbyImageData?.images?.fallback?.src;

  const css = `
    @media (max-width: 767px) {
      .hero-home {
        background-image: url("${mobileImage?.gatsbyImageData?.images?.fallback?.src}");
        background-position: center;
      }
    }
  `;

  return (
    <div className="wrapper-hero">
      <style scoped>{css}</style>

      <div className="hero-home" style={{ backgroundImage: `url(${bgImageUrl})` }}>
        <div className="container">
          <div className="content">
            {title && <h1>{title}</h1>}
            {subtitle && <div className="introduction" dangerouslySetInnerHTML={{ __html: subtitle }} />}

            {form && <HubspotForm {...form} style="homepage" />}
          </div>
        </div>

        <div className="overlay" />
      </div>
    </div>
  );
}

export default HomeHero;
