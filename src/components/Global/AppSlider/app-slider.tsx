import React, { ReactNode } from 'react';
import Slider, { Settings as SlickSettings } from 'react-slick';

type AppSliderProps = {
  children: ReactNode;
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  responsive?: SlickSettings['responsive'];
};

const AppSlider: React.FC<AppSliderProps> = ({
  children,
  slidesToShow = 5,
  slidesToScroll = 1,
  autoplay = true,
  responsive = [],
}) => {
  const settings: SlickSettings = {
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
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default AppSlider;
