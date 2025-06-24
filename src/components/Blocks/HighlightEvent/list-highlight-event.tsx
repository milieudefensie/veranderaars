import React from 'react';
import EventCard from './event-card';
import CtaList from '../../Global/Cta/cta-list'; // @ts-expect-error
import { formatCslEvents } from '../../../utils';
import { EventType } from '../../../types';

import './styles.scss';

interface CtaItem {
  id: string;
  link: string;
  label: string;
}

interface ListHighlightEventProps {
  block: {
    sectionTitle: string;
    cta?: CtaItem[];
    items?: EventType[];
  };
  context?: {
    cslHighlightEvent?: Event;
  };
}

const ListHighlightEvent: React.FC<ListHighlightEventProps> = ({ block, context }) => {
  const { sectionTitle, cta = [], items = [] } = block;
  const hasItems = Array.isArray(items) && items.length > 0;

  const highlightedEvent = context?.cslHighlightEvent ? formatCslEvents(context.cslHighlightEvent) : null;

  if (highlightedEvent && !items.some((item) => item.id === highlightedEvent.id)) {
    items.push(highlightedEvent);

    items.sort((a, b) => {
      return new Date(a.rawStartDate!).getTime() - new Date(b.rawStartDate!).getTime();
    });
  }

  const finalItems: EventType[] =
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
