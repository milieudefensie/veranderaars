import React from 'react';
import CTSlider from './image-slider';
import GlobalImage from './global-image'; // @ts-expect-error
import pictureBtn from '../../Icons/picture.svg';

import './index.scss';

interface ImageWrapperProps {
  image:
    | { gatsbyImageData?: any; url?: string; title?: string; alt?: string }
    | { gatsbyImageData?: any; url?: string }[];
  imageMobile?: { gatsbyImageData?: any } | { gatsbyImageData?: any }[];
  [key: string]: any;
}

const ImageWrapper: React.FC<ImageWrapperProps> = ({ image, imageMobile = null, ...props }) => {
  if (Array.isArray(image) && image.length > 1) {
    return (
      <CTSlider>
        {image.map((img, index) => (
          <GlobalImage key={index} image={img} {...props} />
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

      {image && (image as { title?: string }).title && (
        <div className="caption">
          <img src={pictureBtn} alt="Caption icon" />
          <span className="image-caption">{(image as { title: string }).title}</span>
        </div>
      )}
    </div>
  );
};

export default ImageWrapper;
