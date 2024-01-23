import React from 'react';
import Cta from './Cta';

import './index.scss';

const CtaList = ({ ctas = [], customVariant = null, off = false }) => {
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
