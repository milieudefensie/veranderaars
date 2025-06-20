import React from 'react';
import Link from '../../Global/Link/link';

import './styles.scss';

interface IconItem {
  id: string;
  link: string;
  label: string;
  introduction: string;
  colorVariant?: string;
  icon: {
    url: string;
    alt: string;
  };
}

interface BlockCtaIconsListProps {
  block: {
    iconsItems: IconItem[];
  };
}

const BlockCtaIconsList: React.FC<BlockCtaIconsListProps> = ({ block }) => {
  const { iconsItems } = block;

  return (
    <div id="cta-icons-list" className="cta-icons-list">
      {iconsItems.map((item) => {
        return (
          <Link to={item.link} key={item.id}>
            <div className={`cta-w-icon ${item.colorVariant ? item.colorVariant : ''}`}>
              <div className="metadata">
                <h5>{item.label}</h5>
                <p>{item.introduction}</p>
              </div>

              <div className="icon">
                <img src={item.icon.url} alt={item.icon.alt} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BlockCtaIconsList;
