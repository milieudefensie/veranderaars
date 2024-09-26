import React from 'react';
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

export default function CTSlider({ children }) {
  return <Slider {...settings}>{children}</Slider>;
}
