import React from 'react';
import Link from '../../Global/Link/Link';
import './styles.scss';

const BlockCtaIconsList = ({ block }) => {
  const { iconsItems } = block;

  return (
    <div id="cta-icons-list" className="cta-icons-list">
      {iconsItems.map((item) => {
        return (
          <Link to={item.link}>
            <div key={item.id} className={`cta-w-icon ${item.colorVariant ? item.colorVariant : ''}`}>
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
