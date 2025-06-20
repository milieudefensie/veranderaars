import React from 'react';
import CtaList from '../../Global/Cta/cta-list';

import './styles.scss';

interface CtaItem {
  id: string;
  label: string;
  link: string;
}

interface BlockCtaListProps {
  block: {
    ctaItems: CtaItem[];
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
