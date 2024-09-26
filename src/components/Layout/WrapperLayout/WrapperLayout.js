import React from 'react';
import './styles.scss';

// Variant options: white, light
const WrapperLayout = ({ variant, responsiveVariant, children }) => {
  return (
    <div className={`wrapper-layout ${variant ? variant : ''} ${responsiveVariant ? responsiveVariant : ''}`}>
      {children}
    </div>
  );
};

export default WrapperLayout;
