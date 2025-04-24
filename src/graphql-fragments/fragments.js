import { graphql } from 'gatsby';

export const DatoCMS = graphql`
  fragment MainNavigation on DatoCmsMenuItem {
    id
    title
    position
    externalUrl
    isButton
    content {
      ... on DatoCmsListTool {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsBasicPage {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsEvent {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsListEvent {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsListGroup {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsTool {
        id
        slug
        model {
          apiKey
        }
      }
      ... on DatoCmsGroup {
        id
        slug
        model {
          apiKey
        }
      }
    }
    treeChildren {
      ... on DatoCmsMenuItem {
        id
        title
        position
        externalUrl
        content {
          ... on DatoCmsListTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsBasicPage {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListGroup {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsGroup {
            id
            slug
            model {
              apiKey
            }
          }
        }
      }
    }
  }

  fragment BlockText on DatoCmsSimpleText {
    __typename
    id: originalId
    text
  }

  fragment BlockLogos on DatoCmsLogo {
    __typename
    title
    id
    item {
      id
      externalLink
      image {
        gatsbyImageData
        url
      }
    }
  }

  fragment BlockMap on DatoCmsMap {
    __typename
    id: originalId
    filterBy {
      id
      title
    }
    cslCalendarName
    labelsInCsl
    textOverlayingMap
    showMap
    showList
    buttonOnMap {
      ...AppCta
    }
    extraEvents
  }

  fragment BlockNarrativeBlock on DatoCmsNarrativeBlock {
    __typename
    id: originalId
    title
    alignment
    textContent
    backgroundColor
    image {
      gatsbyImageData(width: 800)
      alt
      url
    }
    xlImage: image {
      gatsbyImageData(width: 1200)
      alt
      url
    }
    imageMobile {
      gatsbyImageData(width: 500)
      alt
      url
    }
    video {
      id
      source {
        url
        thumbnailUrl
      }
      preview {
        gatsbyImageData
        url
      }
    }
    ctas {
      ...AppCta
    }
  }

  fragment BlockAccordion on DatoCmsAcordion {
    __typename
    id: originalId
    colorVariant
    items {
      title
      text
    }
  }

  fragment BlockImage on DatoCmsImage {
    __typename
    id: originalId
    image {
      url
      gatsbyImageData
      title
    }
  }

  fragment BlockShare on DatoCmsShare {
    __typename
    id: originalId
    title
    socialLinks {
      ... on DatoCmsSocialLink {
        id
        url
        socialNetwork
      }
    }
  }

  fragment BlockHighlightTools on DatoCmsHighlightTool {
    __typename
    id: originalId
    sectionTitle
    items {
      ... on DatoCmsToolItem {
        id
        title
        introduction
        image {
          gatsbyImageData(width: 900, height: 505)
        }
        icon {
          url
        }
        iconFontPicker
        backgroundColor
        cta {
          ...AppCta
        }
      }
    }
  }

  fragment BlockHighlightEvent on DatoCmsHighlightEvent {
    __typename
    id: originalId
    sectionTitle
    cta {
      ...AppCta
    }
    items {
      ... on DatoCmsEvent {
        id
        title
        slug
        externalLink
        introduction
        date
        hourStart
        hourEnd
        onlineEvent
        tags {
          ... on DatoCmsTag {
            id
            title
          }
        }
        image {
          gatsbyImageData(width: 900, height: 505)
        }
        model {
          apiKey
        }
      }
    }
  }

  fragment BlockTable on DatoCmsTable {
    __typename
    id: originalId
    table
  }

  fragment BlockEmbedIframe on DatoCmsEmbedIframe {
    __typename
    id: originalId
    iframeCode
  }

  fragment BlockVideo on DatoCmsVideoBlock {
    __typename
    id: originalId
    video {
      url
      thumbnailUrl
    }
  }

  fragment BlockTextHubspot on DatoCmsTextHubspotForm {
    __typename
    id: originalId
    title
    description
    hubspot {
      ... on DatoCmsHubspot {
        formId
        region
        portalId
        columns
        trackErrors
      }
    }
  }

  fragment AppCta on DatoCmsCta {
    id
    title
    style
    link {
      ... on DatoCmsGlobalLink {
        id
        externalUrl
        content {
          ... on DatoCmsListTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsBasicPage {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListGroup {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsGroup {
            id
            slug
            model {
              apiKey
            }
          }
        }
      }
    }
  }

  fragment BlockColumns on DatoCmsColumn {
    __typename
    id: originalId
    firstColumn {
      __typename
      ... on DatoCmsBlockCta {
        ...BlockCustomCta
      }
      ... on DatoCmsSimpleText {
        ...BlockText
      }
    }
    secondColumn {
      __typename
      ... on DatoCmsBlockCta {
        ...BlockCustomCta
      }
      ... on DatoCmsSimpleText {
        ...BlockText
      }
    }
  }

  fragment BlockCountdown on DatoCmsCountdown {
    __typename
    id: originalId
    headline
    successMessage
    date
    colorVariant
  }

  fragment BlockCtaList on DatoCmsCtaList {
    __typename
    id: originalId
    ctaItems: items {
      ...BlockCustomCta
    }
  }

  fragment BlockCtaIconsList on DatoCmsCtaIconsList {
    __typename
    id: originalId
    iconsItems: items {
      ... on DatoCmsCtaWithIcon {
        id
        label
        introduction
        icon {
          url
          alt
        }
        colorVariant
        link {
          id
          label
          externalUrl
          content {
            ... on DatoCmsListTool {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsBasicPage {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsEvent {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsListEvent {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsListGroup {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsTool {
              id
              slug
              model {
                apiKey
              }
            }
            ... on DatoCmsGroup {
              id
              slug
              model {
                apiKey
              }
            }
          }
        }
      }
    }
  }

  fragment BlockImageGallery on DatoCmsImageGallery {
    __typename
    id: originalId
    headline
    imageItems: items {
      ...BlockImage
    }
  }

  fragment BlockCustomCta on DatoCmsBlockCta {
    __typename
    id: originalId
    title
    style
    alignment
    link {
      ... on DatoCmsGlobalLink {
        id
        label
        externalUrl
        content {
          __typename
          ... on DatoCmsListTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsBasicPage {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListEvent {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsListGroup {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsTool {
            id
            slug
            model {
              apiKey
            }
          }
          ... on DatoCmsGroup {
            id
            slug
            model {
              apiKey
            }
          }
        }
      }
    }
  }

  fragment EventCard on DatoCmsEvent {
    id
    __typename
    title
    slug
    model {
      apiKey
    }
    introduction
    date
    rawDate: date
    hourStart
    hourEnd
    onlineEvent
    address
    region
    tags {
      ... on DatoCmsTag {
        id
        title
      }
    }
    externalLink
    image {
      url
    }
    coordinates {
      latitude
      longitude
    }
    collection {
      ... on DatoCmsEventCollection {
        id
        title
      }
    }
  }

  fragment EventCollectionCard on DatoCmsEventCollection {
    id
    title
    subtitle
    description
    ctas {
      ...AppCta
    }
    relatedEvents {
      ...EventCard
    }
    image {
      url
    }
  }

  fragment CSLEventCard on ExternalEvent {
    __typename
    id: slug
    slug
    title
    description
    start_at
    end_at
    raw_start
    raw_end
    image_url
    labels
    start_in_zone
    end_in_zone
    location {
      latitude
      longitude
      venue
      street
      query
      region
    }
    calendar {
      name
      slug
    }
    hiddenAddress
    waiting_list_enabled
    max_attendees_count
  }
`;
