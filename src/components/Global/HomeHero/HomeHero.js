import React from 'react';
import FormSteps from '../FormSteps/FormSteps';

import './index.scss';

function HomeHero({ title, subtitle, image, form = null }) {
  const bgImageUrl = image?.gatsbyImageData?.images?.fallback?.src;

  return (
    <div id="hero-homepage" className="wrapper-hero">
      <FormSteps title={title} description={subtitle} form={form} bgImageUrl={bgImageUrl} />
    </div>
  );
}

export default HomeHero;
