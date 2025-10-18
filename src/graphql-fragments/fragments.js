import { graphql } from 'gatsby';

export const DatoCMS = graphql`
  fragment MainNavigation on DatoCmsMenuItem {
    id
    title
    position
    externalUrl
    isButton
    variant
    icon
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

  fragment BlockTestimonial on DatoCmsTestimonial {
    id: originalId
    authorName
    content
    authorImage {
      url
      alt
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
      ...EventCard
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
    variant
    hubspot {
      ... on DatoCmsHubspot {
        id
        formId
        region
        portalId
        columns
        trackErrors
        disclaimerText
        introductionText
        title
      }
    }
    formSteps {
      ... on DatoCmsHubspot {
        id
        formId
        region
        portalId
        columns
        trackErrors
        disclaimerText
        introductionText
        title
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
    beknopteAddress
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
    cslCalendarSlug
  }

  fragment EventPage on DatoCmsEvent {
    id
    title
    slug
    externalLink
    date
    hourStart
    hourEnd
    address
    region
    shareMessage
    formSteps {
      ...FormStepBlock
    }
    registrationForm {
      ...HubspotBlock
    }
    formBackgroundColor
    tags {
      ... on DatoCmsTag {
        id
        title
      }
    }
    introduction
    image {
      url
    }
    collection {
      ... on DatoCmsEventCollection {
        id
        title
      }
    }
    othersSignalGroups {
      ...SignalGroups
    }
    withTravelTogetherTool
    content {
      value
      blocks {
        __typename
        ...BlockEmbedIframe
        ...BlockTestimonial
        ...BlockNarrativeBlock
        ...BlockHighlightEvent
        ...BlockHighlightTools
        ...BlockTextHubspot
        ...BlockTable
        ...BlockShare
        ...BlockEmbedIframe
        ...BlockVideo
        ...BlockCustomCta
        ...BlockImage
        ...BlockAccordion
        ...BlockMap
        ...BlockColumns
        ...BlockCountdown
        ...BlockCtaList
        ...BlockCtaIconsList
        ...BlockImageGallery
      }
    }
    seo: seoMetaTags {
      ...GatsbyDatoCmsSeoMetaTags
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
      locality
    }
    calendar {
      name
      slug
    }
    hiddenAddress
    waiting_list_enabled
    max_attendees_count
    additional_image_sizes_url {
      url
      style
    }
  }

  fragment CSLEventPage on ExternalEvent {
    __typename
    id
    slug
    title
    url
    description
    rich_description
    raw_start
    raw_end
    start_at
    end_at
    start_in_zone
    end_in_zone
    time_zone
    virtual
    launched_at
    locale
    image_url
    hiddenAddress
    location {
      latitude
      longitude
      postal_code
      country
      region
      locality
      query
      street
      street_number
      venue
    }
    calendar {
      name
      slug
    }
    labels
    inputs
    web_conference_url
    max_attendees_count
    waiting_list_enabled
    additional_image_sizes_url {
      url
      style
    }
  }

  fragment HubspotBlock on DatoCmsHubspot {
    id
    formId
    region
    portalId
    columns
    trackErrors
    disclaimerText
    introductionText
    title
  }

  fragment FormStepBlock on DatoCmsForm2Step {
    id
    firstForm {
      ...HubspotBlock
    }
    secondForm {
      ...HubspotBlock
    }
    forms {
      ...HubspotBlock
    }
    legalText
    legalTextSecond
    firstStepIntroduction
    secondStepIntroduction
  }

  fragment BlockGroupsSignal on DatoCmsGroupsSignalChat {
    id: originalId
    internalName
  }

  fragment SignalGroups on DatoCmsSignalGroup {
    id
    internalName
    url
  }
`;
