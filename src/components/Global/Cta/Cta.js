import React from 'react';
import Link from '../Link/Link';

import './index.scss';

export default function Cta({
  cta = null,
  url = '',
  externalTitle = '',
  isButton = false,
  customVariant = null,
  off = false,
}) {
  const isPrimaryStyle = cta?.style === 'primary' || isButton;
  const isGreenStyle = cta?.style === 'secondary';
  const isOutlinedStyle = cta?.style === 'outlined';

  console.log({ isPrimaryStyle, isGreenStyle, isOutlinedStyle });

  if (off) {
    return (
      <span
        className={`custom-btn 
        ${isPrimaryStyle ? 'custom-btn-primary' : ''} 
        ${isGreenStyle ? 'green' : ''}
        ${cta?.buttonStyle ? cta.buttonStyle : ''} 
        ${customVariant ? customVariant : ''}`}
      >
        {externalTitle || cta?.title}
      </span>
    );
  }

  return (
    <Link
      className={`custom-btn         
      ${isPrimaryStyle ? 'custom-btn-primary' : ''} 
      ${isGreenStyle ? 'green' : ''} 
      ${cta?.buttonStyle ? cta.buttonStyle : ''}
      ${customVariant ? customVariant : ''}`}
      to={cta || url}
      target={url ? '_blank' : ''}
    >
      {externalTitle || cta?.title}
    </Link>
  );
}
