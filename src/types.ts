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
  region?: string;
  location?: LocationType;
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
};

export type ModelType = {
  apiKey: string;
};

export type CtaType = {};
