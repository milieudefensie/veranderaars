import React from 'react';
import { GatsbyImage, getImage, withArtDirection, IGatsbyImageData } from 'gatsby-plugin-image';

interface GlobalImageProps {
  image: {
    alt?: string;
    gatsbyImageData?: IGatsbyImageData;
    url?: string;
  };
  imageMobile?: {
    gatsbyImageData?: IGatsbyImageData;
  };
  alt?: string;
  [key: string]: any;
}

const GlobalImage: React.FC<GlobalImageProps> = ({ image, imageMobile, ...props }) => {
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
    return null;
  }
};

export default GlobalImage;
