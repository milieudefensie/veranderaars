import React from 'react';
import Link from '../Link/link';
import './index.scss';

interface CtaProps {
  cta?: {
    style?: 'primary' | 'secondary';
    title?: string;
    buttonStyle?: string;
    externalUrl?: string;
  } | null;
  url?: string;
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
