import React from 'react';
import ToolCard, { Tool } from './tool-card';

import './styles.scss';

interface HighlightToolsProps {
  block: {
    sectionTitle?: string;
    items: Tool[];
  };
}

const HighlightTools: React.FC<HighlightToolsProps> = ({ block }) => {
  const { sectionTitle, items = [] } = block;

  const numColumns = items.length % 3 === 0 ? 3 : items.length % 2 === 0 ? 2 : 3;

  return (
    <section className="highlight-tools-section2">
      {sectionTitle && (
        <div className="header">
          <h3>{sectionTitle}</h3>
        </div>
      )}

      <div className="content-tool">
        <div className="row gy-4">
          {items.map((item) => (
            <div className={`col-wrapper col-lg-${12 / numColumns}`} key={item.id}>
              <ToolCard tool={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightTools;
