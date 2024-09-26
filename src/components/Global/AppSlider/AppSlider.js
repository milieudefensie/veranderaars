import React from 'react';
import Slider from 'react-slick';

const AppSlider = ({ children, slidesToShow = 5, slidesToScroll = 1, autoplay = true, responsive = [] }) => {
  const Settings = {
    autoplay,
    autoplaySpeed: 5000,
    speed: 1000,
    dots: false,
    infinite: true,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    responsive,
  };

  return (
    <div>
      <Slider {...Settings}>{children}</Slider>
    </div>
  );
};

export default AppSlider;
