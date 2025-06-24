import React from 'react';
import CtaList from '../../Global/Cta/cta-list';
import { CTARawType } from '../../Global/Cta/cta';

import './styles.scss';

interface BlockCtaListProps {
  block: {
    ctaItems: CTARawType[];
  };
}

const BlockCtaList: React.FC<BlockCtaListProps> = ({ block }) => {
  const { ctaItems } = block;

  return (
    <div className="block-cta-list">
      <CtaList ctas={ctaItems} />
    </div>
  );
};

export default BlockCtaList;
