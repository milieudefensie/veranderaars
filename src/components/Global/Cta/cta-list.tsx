import React from 'react';
import Cta from './cta';
import './index.scss';

interface CtaItem {
  id?: string;
  title: string;
  style?: string;
  externalUrl?: string;
  buttonStyle?: string;
}

interface CtaListProps {
  ctas?: CtaItem[];
  customVariant?: string | undefined;
  off?: boolean;
}

const CtaList: React.FC<CtaListProps> = ({ ctas = [], customVariant, off = false }) => {
  if (!ctas || ctas.length === 0) return null;

  return (
    <div className="ctas">
      {ctas.map((cta, index) => (
        <Cta key={cta.id ?? `cta-${index}`} cta={cta} customVariant={customVariant} off={off} />
      ))}
    </div>
  );
};

export default CtaList;
