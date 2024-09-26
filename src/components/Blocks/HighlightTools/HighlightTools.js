import React from 'react';
import ToolCard from './ToolCard';

import './styles.scss';

const HighlightTools = ({ block }) => {
  const { sectionTitle, items = [] } = block;

  const numColumns = items.length % 3 === 0 ? 3 : items.length % 2 === 0 ? 2 : 3;

  return (
    <section className="highlight-tools-section">
      <div className="container">
        {sectionTitle && (
          <div className="header">
            <h3>{sectionTitle}</h3>
          </div>
        )}

        {/* Items */}
        <div className="content-tool">
          <div className="row gy-4">
            {items.map((item) => (
              <div className={`col-lg-${12 / numColumns}`} key={item.id}>
                <ToolCard tool={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightTools;
