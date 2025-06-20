import React from 'react';
import AppSlider from '../../Global/AppSlider/app-slider';
import ImageWrapper from '../../Global/Image/image-wrapper';

import './styles.scss';

interface Image {
  url: string;
  alt?: string;
}

interface LogoItem {
  id: string;
  image: Image;
  externalLink?: string;
}

interface LogosBlock {
  title?: string;
  item: LogoItem[];
}

interface LogosProps {
  block: LogosBlock;
}

const Logos: React.FC<LogosProps> = ({ block }) => {
  const { title, item } = block;

  const logosResponsiveSettings = [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  return (
    <div className="logos-block">
      <div className="row">
        <div className="col-12">
          {title && (
            <h2 className="text-with-border-color">
              <span>{title}</span>
            </h2>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12 logo-slider">
          <AppSlider responsive={logosResponsiveSettings}>
            {item.map((logo) => {
              if (logo.externalLink) {
                return (
                  <a key={logo.id} href={logo.externalLink} target="_blank" rel="noreferrer">
                    <ImageWrapper image={logo.image} />
                  </a>
                );
              }

              return (
                <div key={logo.id}>
                  <ImageWrapper image={logo.image} />
                </div>
              );
            })}
          </AppSlider>
        </div>
      </div>
    </div>
  );
};

export default Logos;
