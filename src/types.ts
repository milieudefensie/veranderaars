import { GatsbyImageProps } from 'gatsby-plugin-image';

// @ts-ignore
declare module '*.svg' {
  const content: string;
  export default content;
}

export type ModelType = {
  apiKey: string;
};

export type ImageType = {
  gatsbyImageData?: unknown;
  url: string;
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

export type EventCalendar = {
  name: string;
  title: string;
  slug: string;
  url: string;
};

export type CtaType = {
  id: string;
  link: string;
  label: string;
};

export type CategorizedEvents = {
  today: EventType[];
  tomorrow: EventType[];
  dayAfterTomorrow: EventType[];
  weekdays: EventType[];
  weekend: EventType[];
  nextWeek: EventType[];
  restOfMonth: EventType[];
};

// Templates
export type CSLEventTemplate = {
  page: {
    title: string;
    slug: string;
    image_url?: string;
    additional_image_sizes_url?: { style: string; url: string }[];
    description: string;
    rich_description?: string;
    start_in_zone?: string;
    end_in_zone?: string;
    location?: LocationType;
    inputs?: any[];
    hiddenAddress?: boolean;
    web_conference_url?: string;
    waiting_list_enabled?: boolean;
    max_attendees_count?: number;
  };
  listEvent?: {
    id: string;
    slug: string;
  };
  favicon: {
    faviconMetaTags: any;
  };
};

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
  rawEndDate: string;
  endInZone: string;
  hiddenAddress?: boolean;
  waiting_list_enabled: boolean;
  max_attendees_count: number;
  rawStartDate?: string;
  cms_status?: string;
};

export type EventTemplate = {
  favicon: {
    faviconMetaTags: any;
  };
  listEvent?: {
    slug: string;
  };
  page: {
    seo: any;
    title: string;
    introduction?: string;
    hourStart?: string;
    hourEnd?: string;
    date?: string;
    address?: string;
    registrationForm?: any;
    formBackgroundColor?: string;
    shareMessage?: string;
    image?: any;
    content?: {
      value: any;
    };
    tags?: Array<{
      id: string;
      title: string;
    }>;
  };
};

export type GroupTemplate = {
  page: {
    id: string;
    title: string;
    slug: string;
    localGroupId?: string;
    address?: string;
    email?: string;
    whatsappGroup?: string;
    organizer?: string;
    introduction?: string;
    alternativeHero?: boolean;
    registrationForm?: {
      formId: string;
      region: string;
      portalId: string;
      columns?: number;
      trackErrors?: boolean;
    };
    image?: {
      gatsbyImageData: GatsbyImageProps['image'];
      url: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    content?: {
      value: any;
      blocks?: any[]; // Puedes definir un tipo más específico para los bloques si lo deseas
    };
    tags?: {
      id: string;
      title: string;
    }[];
    relatedEvents?: {
      id: string;
      title: string;
      slug: string;
      externalLink?: string;
      introduction?: string;
      date: string;
      hourStart?: string;
      hourEnd?: string;
      address?: string;
      tags?: {
        id: string;
        title: string;
      }[];
      image?: {
        gatsbyImageData: GatsbyImageProps['image'];
      };
      model: {
        apiKey: string;
      };
    }[];
    seo: {
      tags: {
        tagName: string;
        attributes: Record<string, string>;
        content?: string;
      }[];
    };
  };
  favicon: {
    faviconMetaTags: {
      tags: {
        tagName: string;
        attributes: Record<string, string>;
        content?: string;
      }[];
    };
  };
  listGroup?: {
    id: string;
    slug: string;
  };
  listEvent?: {
    id: string;
    slug: string;
  };
  allEvents: {
    edges: {
      node: {
        id: string;
        slug: string;
        title: string;
        externalLink?: string;
        introduction?: string;
        date: string;
        rawDate: string;
        hourStart?: string;
        hourEnd?: string;
        onlineEvent?: boolean;
        region?: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
        tags?: {
          id: string;
          title: string;
        }[];
        image?: {
          url: string;
          gatsbyImageData: GatsbyImageProps['image'];
        };
        model: {
          apiKey: string;
        };
      };
    }[];
  };
  allCSLEvents: {
    edges: {
      node: {
        __typename: string;
        id: string;
        slug: string;
        title: string;
        description?: string;
        start_at: string;
        raw_start: string;
        raw_end: string;
        end_at: string;
        image_url?: string;
        start_in_zone?: string;
        end_in_zone?: string;
        labels?: string[];
        location?: {
          latitude: number;
          longitude: number;
          venue?: string;
          query?: string;
          region?: string;
        };
        hiddenAddress?: boolean;
      };
    }[];
  };
  allPastCSLEvents: {
    edges: {
      node: {
        __typename: string;
        id: string;
        slug: string;
        title: string;
        description?: string;
        start_at: string;
        raw_start: string;
        raw_end: string;
        end_at: string;
        image_url?: string;
        start_in_zone?: string;
        end_in_zone?: string;
        labels?: string[];
        location?: {
          latitude: number;
          longitude: number;
          venue?: string;
          query?: string;
          region?: string;
        };
        hiddenAddress?: boolean;
      };
    }[];
  };
  locales: {
    edges: {
      node: {
        ns: string;
        data: string;
        language: string;
      };
    }[];
  };
};

export type HomepageTemplate = {
  locales: {
    edges: {
      node: {
        ns: string;
        data: string;
        language: string;
      };
    }[];
  };
  favicon: {
    faviconMetaTags: {
      tags: {
        tagName: string;
        attributes: Record<string, string>;
        content?: string;
      }[];
    };
  };
  cslHighlightEvent?: {
    __typename: string;
    id: string;
    slug: string;
    title: string;
    description?: string;
    start_at: string;
    end_at: string;
    raw_start: string;
    raw_end: string;
    image_url?: string;
    labels?: string[];
    start_in_zone?: string;
    end_in_zone?: string;
    location?: {
      latitude: number;
      longitude: number;
      venue?: string;
      query?: string;
      region?: string;
    };
    calendar?: {
      name: string;
      slug: string;
    };
    hiddenAddress?: boolean;
  };
  page: {
    id: string;
    title: string;
    subtitle?: string;
    seo?: {
      tags: {
        tagName: string;
        attributes: Record<string, string>;
        content?: string;
      }[];
    };
    heroImage?: {
      gatsbyImageData: GatsbyImageProps['image'];
    };
    mobileHeroImage?: {
      gatsbyImageData: GatsbyImageProps['image'];
    };
    form?: {
      id: string;
      formId: string;
      portalId: string;
      region: string;
      internalName?: string;
      columns?: number;
    };
    blocks?: any[];
  };
};

export type ListGroupTemplate = {
  page: {
    id: string;
    title: string;
    slug: string;
    content?: {
      value: any;
      blocks: any[];
    };
    seo?: {
      tags: any;
    };
  };
  allGroups: {
    edges: {
      node: {
        id: string;
        title: string;
        slug: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
        model: {
          apiKey: string;
        };
        image: {
          url: string;
          gatsbyImageData: GatsbyImageProps;
        };
        tags: {
          id: string;
          title: string;
        }[];
      };
    }[];
  };
  favicon: {
    faviconMetaTags: {
      tags: any;
    };
  };
};

export type ListToolsTemplate = {
  favicon: {
    faviconMetaTags: {
      tags: any;
    };
  };
  page: {
    title: string;
    introduction?: string | null;
    backgroundColor?: string | null;
    heroBackgroundImage?: {
      url: string;
      gatsbyImageData: GatsbyImageProps['image'];
    } | null;
    seo?: {
      tags: any;
    } | null;
    content?: {
      value: any;
      blocks?: any[];
    } | null;
  };
};

export type ListWhatsappGroupsTemplate = {
  page: {
    id: string;
    title: string;
    slug: string;
    blocks: any[];
    seo: {
      tags: any[];
    };
  };
  favicon: {
    faviconMetaTags: {
      tags: any[];
    };
  };
  allGroups: {
    edges: {
      node: Group;
    }[];
  };
};

export type BasicPageTemplate = {
  page: {
    seo: any;
    title: string;
    introduction?: string;
    backgroundColor: string;
    heroBackgroundImage: {
      url: string;
      gatsbyImageData: GatsbyImageProps;
    };
    smallHero?: boolean;
    content: {
      value: string;
      blocks: any[];
    };
  };
  favicon: {
    faviconMetaTags: any;
  };
};

export type PageWhatsappComTemplate = {
  favicon: {
    faviconMetaTags: any;
  };
  page: {
    seo: any;
    title: string;
    introduction?: string;
    backgroundColor: string;
    heroBackgroundImage: {
      url: string;
      gatsbyImageData: GatsbyImageProps;
    };
    blocks: any[];
  };
};

export type ToolTemplate = {
  page: {
    id: string;
    title: string;
    slug: string;
    introduction?: string;
    heroImage?: {
      gatsbyImageData: any;
      url: string;
    };
    content?: {
      value: any;
      blocks?: any[];
    };
    seo: any;
  };
  listTool: {
    id: string;
    slug: string;
    model: {
      apiKey: string;
    };
  };
  favicon: {
    faviconMetaTags: any;
  };
};

// Models
type Group = {
  id: string;
  title: string;
  whatsappGroup: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image?: {
    gatsbyImageData: GatsbyImageProps;
  };
  tags?: {
    id: string;
    title: string;
  }[];
};

// Utils
type LocationType = {
  venue?: string;
  locality?: string;
};

export type SignalGroupType = {
  id: string;
  url: string;
  internalName: string;
};
