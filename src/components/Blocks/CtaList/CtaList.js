import React from 'react';
import CtaList from '../../Global/Cta/CtaList';

import './styles.scss';

const BlockCtaList = ({ block }) => {
  const { ctaItems } = block;

  return (
    <div className="block-cta-list">
      <CtaList ctas={ctaItems} />
    </div>
  );
};

export default BlockCtaList;
