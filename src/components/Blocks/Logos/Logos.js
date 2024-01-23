import React from 'react';
import AppSlider from '../../Global/AppSlider/AppSlider';
import ImageWrapper from '../../Global/Image/ImageWrapper';

import './styles.scss';

function Logos({ block }) {
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
      <div className="container">
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
              {item.map((item) => {
                if (item.externalLink) {
                  return (
                    <a key={item.id} href={item.externalLink} target="_blank">
                      <ImageWrapper image={item.image} />
                    </a>
                  );
                }

                return (
                  <div key={item.id}>
                    <ImageWrapper image={item.image} />
                  </div>
                );
              })}
            </AppSlider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logos;
