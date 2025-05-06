import React, { ReactNode } from 'react';
import Slider from 'react-slick';

const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

interface CTSliderProps {
  children: ReactNode;
}

const CTSlider: React.FC<CTSliderProps> = ({ children }) => {
  return <Slider {...settings}>{children}</Slider>;
};

export default CTSlider;
