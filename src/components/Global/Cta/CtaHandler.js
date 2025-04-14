import React from 'react';
import './index.scss';

export default function CtaHandler({ title, icon = null, handleOnClick, isPrimaryButton = false, variant }) {
  return (
    <div
      className={`custom-btn with-handler ${isPrimaryButton ? 'custom-btn-primary' : ''} ${variant ? variant : ''}`}
      onClick={handleOnClick}
    >
      {title || 'Klik hier'}
      {icon && icon}
    </div>
  );
}
