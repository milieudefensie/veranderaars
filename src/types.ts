export type EventType = {
  id: string;
  __typename?: string;
  type: string;
  title: string;
  slug?: string;
  model?: ModelType;
  introduction: string;
  date?: string;
  hourStart?: string;
  hourEnd?: string;
  image?: ImageType;
  image_url?: string;
  tags?: any[];
  externalLink?: string;
  url?: string;
  online_event?: boolean;
  address?: string;
  beknopteAddress?: string;
  region?: string;
  location?: LocationType;
  collection?: EventCollectionType;
  rawDate?: string;
  calendar?: EventCalendar;
  additional_image_sizes_url: any;
  startInZone?: string;
};

export type EventCalendar = {
  name: string;
  title: string;
  slug: string;
  url: string;
};

export type ImageType = {
  gatsbyImageData?: unknown;
  url: string;
};

export type LocationType = {
  latitude: number;
  longitude: number;
  postal_code: string;
  country: string;
  region: string;
  locality: string;
  query: string;
  street: string;
  street_number: string;
  venue: string;
};

export type EventCollectionType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctas?: CtaType[];
  image?: ImageType;
  relatedEvents?: EventType[];
  cslCalendarSlug?: string;
};

export type ModelType = {
  apiKey: string;
};

export type CtaType = {};

export type CategorizedEvents = {
  today: EventType[];
  tomorrow: EventType[];
  dayAfterTomorrow: EventType[];
  weekdays: EventType[];
  weekend: EventType[];
  nextWeek: EventType[];
  restOfMonth: EventType[];
};
