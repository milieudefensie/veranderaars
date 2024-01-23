import React from 'react';
import CTSlider from './CTSlider';
import GlobalImage from './GlobalImage';
import pictureBtn from '../../Icons/picture.svg';

import './index.scss';

export default function ImageWrapper({ image, imageMobile = null, ...props }) {
  if (Array.isArray(image) && image.length > 1) {
    return (
      <CTSlider>
        {image.map((img) => (
          <GlobalImage image={img} {...props} />
        ))}
      </CTSlider>
    );
  }

  return (
    <div className="image-wrapper">
      <GlobalImage
        image={Array.isArray(image) ? image[0] : image}
        imageMobile={Array.isArray(imageMobile) ? imageMobile[0] : imageMobile}
        {...props}
      />

      {image?.title && (
        <div className="caption">
          <img src={pictureBtn} alt="Caption icon" />
          <span className="image-caption">{image.title}</span>
        </div>
      )}
    </div>
  );
}
