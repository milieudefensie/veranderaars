import React from 'react';
import './index.scss';

function HeroBasic({
  title,
  image = null,
  backgroundColor = null,
  responsiveVariant,
  overlay = true,
  external = false,
  alternative = false,
  small = false,
}) {
  const heroBgImage = image?.url ? `url(${image.url})` : undefined;

  return (
    <div
      className={`hero-basic ${alternative ? 'alternative' : ''} ${backgroundColor ? backgroundColor : ''} ${heroBgImage ? 'with-bg-image' : ''} ${
        responsiveVariant ? responsiveVariant : ''
      } ${external ? 'external-img' : ''} ${small ? 'small' : ''}`}
      style={{ backgroundImage: heroBgImage }}
    >
      <div className="container">
        <h1>{title}</h1>
      </div>

      {heroBgImage && overlay && <div className="overlay" />}
    </div>
  );
}

export default HeroBasic;
