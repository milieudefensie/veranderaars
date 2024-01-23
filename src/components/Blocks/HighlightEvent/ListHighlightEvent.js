import React from 'react';
import EventCard from './EventCard';
import CtaList from '../../Global/Cta/CtaList';

import './styles.scss';

const ListHighlightEvent = ({ block }) => {
  const { sectionTitle, cta = [], items = [] } = block;
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className={`highlight-event-section ${hasItems ? '' : 'empty'}`}>
      <div className="container">
        <div className="header">
          <h3>{sectionTitle}</h3>

          <div className="desktop-ctas">
            <CtaList ctas={cta} />
          </div>
        </div>

        {/* Items */}
        <div className="content">
          {items.map((item) => (
            <EventCard event={item} key={item.id} />
          ))}
        </div>

        <div className="mobile-ctas">
          <CtaList ctas={cta} />
        </div>
      </div>
    </section>
  );
};

export default ListHighlightEvent;
