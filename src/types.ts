export type EventType = {
  id: string;
  __typename: string;
  type: string;
  title: string;
  slug: string;
  model: Model;
  introduction: string;
  date: string;
  location: string;
  image: {
    gatsbyImageData?: unknown;
    url: string;
  };
  image_url?: string;
  tags?: any[];
  externalLink?: string;
  url?: string;
};

export type EventCollectionType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctas?: CtaType[];
};

export type Model = {
  apiKey: string;
};

export type CtaType = {};
