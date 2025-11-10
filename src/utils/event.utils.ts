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

  const uniqueCollections = parentCollection.filter(
    (col, index, self) => index === self.findIndex((c) => c.title === col.title)
  );

  return uniqueCollections;
};

export const isLocalGroupOrganizer = (event: EventType, configuration: any) => {
  return configuration?.cslLocalGroupsSlugs.includes(event.calendar?.slug!);
};
