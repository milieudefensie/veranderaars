import React, { useState, ReactNode } from 'react';
import './styles.scss';

type Tab = {
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultIndex?: number;
  variant?: 'default' | 'pill' | 'underlined';
  className?: string;
};

const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, variant = 'underlined', className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className={`tabs ${variant} ${className}`}>
      <div className="tabs__list">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`tabs__button ${isActive ? 'is-active' : ''}`}
            >
              <div dangerouslySetInnerHTML={{ __html: tab.label }} />
            </button>
          );
        })}
      </div>

      <div className="tabs__content">
        {tabs.map((tab, index) => (
          <div key={index} className={`tabs__panel ${activeIndex === index ? 'is-active' : ''}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
