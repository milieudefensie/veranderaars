import React from 'react';
import Cta, { CTARawType } from './cta';
import './index.scss';

interface CtaListProps {
  ctas?: CTARawType[];
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
