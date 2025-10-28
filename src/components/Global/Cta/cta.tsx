import React from 'react';
import Link from '../Link/link';
import './index.scss';

export interface CTARawType {
  id?: string;
  style?: 'primary' | 'secondary';
  title?: string;
  buttonStyle?: string;
  externalUrl?: string;
}

export interface CtaProps {
  id?: string;
  cta?: CTARawType | null;
  url?: string;
  predefinedUrl?: string;
  externalTitle?: string;
  isButton?: boolean;
  customVariant?: string;
  off?: boolean;
}

const Cta: React.FC<CtaProps> = ({
  cta = null,
  url = '',
  externalTitle = '',
  isButton = false,
  customVariant = '',
  off = false,
  predefinedUrl = '',
}) => {
  const isPrimaryStyle = cta?.style === 'primary' || isButton;
  const isGreenStyle = cta?.style === 'secondary';

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

  if (cta?.externalUrl) {
    return <a href={'/' + cta.externalUrl}>{externalTitle || cta.title}</a>;
  }

  if (predefinedUrl) {
    return (
      <Link
        className={`custom-btn         
      ${isPrimaryStyle ? 'custom-btn-primary' : ''} 
      ${isGreenStyle ? 'green' : ''} 
      ${cta?.buttonStyle ? cta.buttonStyle : ''}
      ${customVariant ? customVariant : ''}`}
        to={predefinedUrl}
      >
        {externalTitle || cta?.title}
      </Link>
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
};

export default Cta;
