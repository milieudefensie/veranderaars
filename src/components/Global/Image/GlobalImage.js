import React from 'react';
import { GatsbyImage, getImage, withArtDirection } from 'gatsby-plugin-image';

const GlobalImage = ({ image, imageMobile, ...props }) => {
  const altImage = image?.alt ? image.alt : props.alt ? props.alt : 'image';
  let images = image?.gatsbyImageData;

  if (imageMobile) {
    images = withArtDirection(getImage(image), [
      {
        media: '(max-width: 768px)',
        image: getImage(imageMobile),
      },
    ]);
  }

  if (image?.gatsbyImageData) {
    return <GatsbyImage alt={altImage} image={images} {...props} />;
  } else if (image?.url) {
    return <img src={image.url} alt={altImage} loading="lazy" />;
  } else {
    return '';
  }
};

export default GlobalImage;
