import React from 'react';
import EventCard from './event-card';
import CtaList from '../../Global/Cta/cta-list';
import { formatCslEvents } from '../../../utils';

import './styles.scss';

interface CtaItem {
  id: string;
  link: string;
  label: string;
}

interface Event {
  id: string;
  rawStartDate: string;
  title: string;
  introduction?: string;
  image?: { gatsbyImageData: any; url: string };
  image_url?: string;
  date: string;
  rawDate: string;
  rawEndDate: string;
  startInZone: string;
  endInZone: string;
  address: string;
  hourStart: string;
  hourEnd: string;
  tags: string[];
  url?: string;
  externalLink?: string;
  hiddenAddress?: boolean;
  waiting_list_enabled: boolean;
  max_attendees_count: number;
}

interface ListHighlightEventProps {
  block: {
    sectionTitle: string;
    cta?: CtaItem[];
    items?: Event[];
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
      return new Date(a.rawStartDate).getTime() - new Date(b.rawStartDate).getTime();
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
