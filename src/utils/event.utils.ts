import { EventCollectionType, EventType } from '../types';

export const findParentCollection = (
  event: EventType,
  collections: {
    nodes: EventCollectionType[];
  }
) => {
  const parentCollection = collections.nodes.find((collection: any) => {
    const hasRelatedEvent = collection.relatedEvents?.some((e: any) => e.slug === event.slug);
    const matchesCalendarSlug = collection.cslCalendarSlug && event.calendar?.slug === collection.cslCalendarSlug;
    return hasRelatedEvent || matchesCalendarSlug;
  });

  return parentCollection;
};

export const isLocalGroupOrganizer = (event: EventType, configuration: any) => {
  return configuration?.cslLocalGroupsSlugs.includes(event.calendar?.slug!);
};
