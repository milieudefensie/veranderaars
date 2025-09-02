import React, { useState } from 'react'; // @ts-expect-error
import accordionOpen from '../../Icons/accordion_open.svg'; // @ts-expect-error
import accordionClose from '../../Icons/accordion_close.svg';

import './index.scss';

interface AccordionItem {
  title: string;
  text: string;
}

interface AccordionProps {
  variant?: string;
  items: AccordionItem[];
  renderCustomTitle?: (item: AccordionItem) => React.ReactNode;
  defaultActive?: number;
}

const Accordion: React.FC<AccordionProps> = ({ variant, items, renderCustomTitle = null, defaultActive = 0 }) => {
  const [activeItem, setActiveItem] = useState<number | null>(defaultActive);

  const handleOnChangeAccordion = (newIndex: number) => {
    if (activeItem === newIndex) {
      setActiveItem(null);
      return;
    }
    setActiveItem(newIndex);
  };

  if (items.length === 0) return null;

  return (
    <div className={`ui-accordion ${variant ? variant : ''}`}>
      {items.map((item, index) => (
        <div key={index} className={`item ${activeItem === index ? 'active' : ''}`}>
          <div className="ac-title" onClick={() => handleOnChangeAccordion(index)}>
            <h3>{renderCustomTitle ? renderCustomTitle(item) : item?.title}</h3>
            <img
              src={activeItem === index ? accordionClose : accordionOpen}
              alt="Accordion close/open icon"
              width={30}
              height={31}
            />
          </div>

          <div id="ac-content" className="ac-content" dangerouslySetInnerHTML={{ __html: item.text }}></div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
