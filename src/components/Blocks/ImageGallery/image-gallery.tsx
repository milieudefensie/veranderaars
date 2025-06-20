import React, { useRef } from 'react';
import Slider from 'react-slick';
import './styles.scss';

interface Image {
  url: string;
  alt?: string;
}

interface Block {
  headline?: string;
  imageItems: { image: Image }[];
}

interface ImageGalleryProps {
  block: Block;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ block }) => {
  const sliderRef = useRef<Slider>(null);
  const { headline, imageItems } = block;

  const Settings = {
    autoplay: false,
    autoplaySpeed: 5000,
    speed: 1000,
    dots: true,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="block-image-gallery">
      {headline && <h2>{headline}</h2>}

      <div className="gallery">
        <Slider ref={sliderRef} {...Settings}>
          {imageItems.map((image, index) => (
            <img key={index} src={image.image.url} alt={image.image.alt || ''} className="images-gallery-photo" />
          ))}
        </Slider>
      </div>
    </div>
  );
};

function SampleNextArrow(props: { className?: string; onClick?: () => void }) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path
          d="M30.0539 26.0714L16.9785 26.0714L16.9785 23.9286L30.0539 23.9286L24.2918 18.1816L25.8107 16.6666L34.166 25L25.8107 33.3333L24.2918 31.8183L30.0539 26.0714Z"
          fill="black"
        />
        <circle cx="25" cy="25" r="24" stroke="black" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props: { className?: string; onClick?: () => void }) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path
          d="M20.7781 23.9286L33.8535 23.9286L33.8535 26.0714L20.7781 26.0714L26.5402 31.8184L25.0213 33.3334L16.666 25L25.0213 16.6667L26.5402 18.1817L20.7781 23.9286Z"
          fill="black"
        />
        <circle cx="25" cy="25" r="24" transform="rotate(-180 25 25)" stroke="black" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default ImageGallery;
