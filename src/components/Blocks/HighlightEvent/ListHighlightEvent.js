import React from 'react';
import EventCard from './EventCard';
import CtaList from '../../Global/Cta/CtaList';
import { formatCslEvents } from '../../../utils';

import './styles.scss';

const ListHighlightEvent = ({ block, context }) => {
  const { sectionTitle, cta = [], items = [] } = block;
  const hasItems = Array.isArray(items) && items.length > 0;

  const highlightedEvent = context?.cslHighlightEvent ? formatCslEvents(context.cslHighlightEvent) : null;
  if (hasItems && highlightedEvent) {
    items.push(highlightedEvent);

    items.sort((a, b) => {
      return new Date(a.rawStartDate) - new Date(b.rawStartDate);
    });
  }

  return (
    <section className={`highlight-event-section ${hasItems ? '' : 'empty'}`}>
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
    </section>
  );
};

export default ListHighlightEvent;
