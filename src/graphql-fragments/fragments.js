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
    id: originalId
    __typename
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

  fragment BlockNarrativeBlock on DatoCmsNarrativeBlock {
    __typename
    id: originalId
    preTitle
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
      ... on DatoCmsCta {
        id
        title
        isButton
        link {
          ... on DatoCmsGlobalLink {
            id
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
  }

  fragment BlockAccordion on DatoCmsAcordion {
    __typename
    id: originalId
    items {
      title
      text
    }
  }

  fragment BlockImage on DatoCmsImage {
    __typename
    id: originalId
    image {
      gatsbyImageData
      title
    }
  }

  fragment BlockShare on DatoCmsShare {
    __typename
    id: originalId
    title
    whatsappGroup
    socialLinks {
      ... on DatoCmsSocialLink {
        id
        title
        url
        socialNetwork
      }
    }
    ctas {
      ... on DatoCmsCta {
        id
        title
        isButton
        link {
          ... on DatoCmsGlobalLink {
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
          ... on DatoCmsCta {
            id
            title
            isButton
            link {
              ... on DatoCmsGlobalLink {
                id
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
      }
    }
  }

  fragment BlockHighlightEvent on DatoCmsHighlightEvent {
    __typename
    id: originalId
    sectionTitle
    cta {
      ... on DatoCmsCta {
        id
        title
        isButton
        link {
          ... on DatoCmsGlobalLink {
            id
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
      }
    }
  }
`;
