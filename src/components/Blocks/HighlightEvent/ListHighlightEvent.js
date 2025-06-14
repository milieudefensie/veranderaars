import React from 'react';
import EventCard from './EventCard';
import CtaList from '../../Global/Cta/CtaList';
import { formatCslEvents } from '../../../utils';

import './styles.scss';

const ListHighlightEvent = ({ block, context }) => {
  const { sectionTitle, cta = [], items = [] } = block;
  const hasItems = Array.isArray(items) && items.length > 0;

  const highlightedEvent = context?.cslHighlightEvent ? formatCslEvents(context.cslHighlightEvent) : null;

  if (highlightedEvent && !items.some((item) => item.id === highlightedEvent.id)) {
    items.push(highlightedEvent);

    items.sort((a, b) => {
      return new Date(a.rawStartDate) - new Date(b.rawStartDate);
    });
  }

  const finalItems =
    Array.isArray(items) && items.length > 0
      ? items
      : context?.buildContext.latestEvent.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section className={`highlight-event-section ${hasItems ? '' : 'empty'}`}>
      <div className="header">
        <h3>{sectionTitle}</h3>

        <div className="desktop-ctas">
          <CtaList ctas={cta} />
        </div>
      </div>

      <div className="content">
        {finalItems.map((item) => (
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
