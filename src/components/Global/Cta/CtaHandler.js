import React from 'react';
import './index.scss';

export default function CtaHandler({ title, handleOnClick, isPrimaryButton = false, variant }) {
  return (
    <div
      className={`custom-btn ${isPrimaryButton ? 'custom-btn-primary' : ''} ${variant ? variant : ''}`}
      onClick={handleOnClick}
    >
      {title || 'Click here'}
    </div>
  );
}
