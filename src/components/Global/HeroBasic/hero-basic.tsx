import React from 'react';
import './index.scss';

interface HeroBasicProps {
  title?: string;
  image?: { url: string } | null;
  backgroundColor?: string | null;
  responsiveVariant?: string;
  overlay?: boolean;
  external?: boolean;
  alternative?: boolean;
  small?: boolean;
}

const HeroBasic: React.FC<HeroBasicProps> = ({
  title,
  image = null,
  backgroundColor = null,
  responsiveVariant,
  overlay = true,
  external = false,
  alternative = false,
  small = false,
}) => {
  const heroBgImage = image?.url ? `url(${image.url})` : undefined;

  return (
    <div
      className={`hero-basic ${alternative ? 'alternative' : ''} ${backgroundColor ?? ''} ${
        heroBgImage ? 'with-bg-image' : ''
      } ${responsiveVariant ?? ''} ${external ? 'external-img' : ''} ${small ? 'small' : ''}`}
      style={{ backgroundImage: heroBgImage }}
    >
      {title && (
        <div className="container">
          <h1>{title}</h1>
        </div>
      )}

      {heroBgImage && overlay && <div className="overlay" />}
    </div>
  );
};

export default HeroBasic;
