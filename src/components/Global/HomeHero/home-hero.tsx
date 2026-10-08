import React from 'react';
import FormSteps from '../FormSteps/FormSteps';
import { HUBSPOT_FORMS_ENABLED } from '../../Blocks/HubspotForm/config';

import './index.scss';

interface HomeHeroProps {
  title?: string;
  subtitle?: string;
  image?: { gatsbyImageData?: { images?: { fallback?: { src: string } } } };
  form?: any | null;
  mobileImage?: { gatsbyImageData?: { images?: { fallback?: { src: string } } } } | null;
}

const HomeHero: React.FC<HomeHeroProps> = ({ title, subtitle, image, form = null, mobileImage = null }) => {
  const bgImageUrl = image?.gatsbyImageData?.images?.fallback?.src;

  return (
    <div id="hero-homepage" className="wrapper-hero">
      <FormSteps
        title={title}
        description={subtitle}
        form={form}
        bgImageUrl={bgImageUrl}
        hideForm={!HUBSPOT_FORMS_ENABLED}
      />
    </div>
  );
};

export default HomeHero;
