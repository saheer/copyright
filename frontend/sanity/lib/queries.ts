import {groq} from 'next-sanity'

// ---------------------------------------------------------------------------
// SEO: the `seoFields` object, as a reusable projection. Add `${seoFragment}`
// inside the projection of any query whose document has a `seo` field.
export const seoFragment = groq`
  "seo": seo{
    metaTitle,
    metaDescription,
    keywords,
    noIndex,
    noFollow,
    "ogImage": ogImage.asset->url,
    "ogImageAlt": ogImage.alt,
    "ogHotspot": ogImage.hotspot{x, y}
  }
`

// SEO of a one-document page: pageSeoQuery with { type: "about" }, { type: "home" } …
export const pageSeoQuery = groq`
  *[_type == $type][0]{
    ${seoFragment}
  }
`

export const homeQuery = groq`
  *[_type == "home"][0]{
    heroHeadingWhite,
    heroHeadingBlue,
    heroDescription,
    heroButtonText,
    heroButtonLink,
    "heroBackground": heroBackground.asset->url,
    "heroBackgroundAlt": heroBackground.alt,
    "logos": logos[defined(asset)]{
      _key,
      "name": coalesce(name, asset->originalFilename),
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    "stats": statsItems[]{_key, value, label},
    statsNote,
    "landscape": {
      "heading": landscapeHeading,
      "description": landscapeDescription,
      "cards": landscapeCards[defined(image.asset)]{
        _key,
        title,
        description,
        "image": image.asset->url,
        "hotspot": image.hotspot{x, y}
      }
    },
    "approach": {
      "heading": approachHeading,
      "description": approachDescription,
      "ctaText": approachCtaText,
      "ctaLink": approachCtaLink,
      "steps": approachSteps[]{
        _key,
        title,
        subtitle,
        highlight,
        "icon": iconFile.asset->url,
        "iconType": iconFile.asset->mimeType
      }
    },
    "services": {
      "eyebrow": servicesEyebrow,
      "heading": servicesHeading,
      "description": servicesDescription,
      "items": servicesItems[]{
        _key,
        title,
        link,
        "icon": iconFile.asset->url,
        "iconType": iconFile.asset->mimeType
      },
      "buttonLabel": buttonLabel,
      "serviceButtonLink": serviceButtonLink
    },
    "why": {
      "mediaType": whyMediaType,
      "videoUrl": coalesce(whyVideoFile.asset->url, whyVideoUrl),
      "image": whyImage.asset->url,
      "imageAlt": whyImage.alt,
      "hotspot": whyImage.hotspot{x, y},
      "features": whyFeatures[]{
        _key,
        title,
        highlight,
        description,
        "icon": iconFile.asset->url,
        "iconType": iconFile.asset->mimeType
      }
    },
    "testimonials": {
      "heading": testimonialsHeading,
      "subtitle": testimonialsSubtitle,
      "items": testimonials[defined(quote)]{
        _key,
        quote,
        position,
        company
      }
    }
  }
`

// ---------------------------------------------------------------------------
// Digital Footprint: ONE Studio document ("Digital Footprint Page") feeds both the
// Home page section and the /digital-footprint page, so there is a single list of
// LinkedIn posts to maintain.
//
// "Newest first" is decided by each post's `postedAt` date (not by list position):
//  - coalesce(): in GROQ a MISSING value sorts FIRST in descending order, which would
//    put old posts without a date on top. Falling back to a very old date puts them last.
//  - `_key` is only a tie-breaker so posts with equal dates always come out in the
//    same order.
const NEWEST_FIRST = 'order(coalesce(postedAt, "1970-01-01T00:00:00Z") desc, _key)'

// Home page section: heading/subtitle for the Home page + the 3 newest posts
export const footprintHomeQuery = groq`
  *[_type == "digitalFootprintPage"][0]{
    "heading": homeHeading,
    "subtitle": homeSubtitle,
    buttonText,
    buttonLink,
    "posts": posts[defined(text)] | ${NEWEST_FIRST}[0...3]{
      _key,
      text,
      timeAgo,
      likes,
      reposts,
      url
    }
  }
`

// Full /digital-footprint page: hero + EVERY post, newest first
export const footprintPageQuery = groq`
  *[_type == "digitalFootprintPage"][0]{
    "title": heroTitle,
    "intro": heroDescription,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "heading": postsHeading,
    "subtitle": postsSubtitle,
    buttonText,
    buttonLink,
    "posts": posts[defined(text)] | ${NEWEST_FIRST}{
      _key,
      text,
      timeAgo,
      likes,
      reposts,
      url
    }
  }
`

// ---------------------------------------------------------------------------
// Digital Digest (blog): documents of type "post".
//
// Only posts that have a slug are listed (a post without one has no URL).
// "Newest first" is decided by `publishedAt`; as with the footprint posts, a missing
// date falls back to a very old one so undated posts sink to the bottom, and
// `_createdAt` breaks ties.
const POST_FILTER = '_type == "post" && defined(slug.current)'
const POST_NEWEST_FIRST =
  'order(coalesce(publishedAt, "1970-01-01") desc, _createdAt desc)'

// Fields every card needs (home section, featured slot, grid)
const POST_CARD = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "hotspot": mainImage.hotspot{x, y}
`

// Home page: the 3 newest posts
export const digestHomeQuery = groq`
  *[${POST_FILTER}] | ${POST_NEWEST_FIRST}[0...3]{${POST_CARD}}
`

// Listing page, part 1: the featured post + how many posts exist.
// Pinned posts win ("featured == true"); among them (or among all posts, when none
// is pinned) the newest comes first.
export const digestFeaturedQuery = groq`
  {
    "featured": *[${POST_FILTER}]
      | order(coalesce(featured, false) desc, coalesce(publishedAt, "1970-01-01") desc, _createdAt desc)[0]{${POST_CARD}},
    "total": count(*[${POST_FILTER}])
  }
`

// Listing page, part 2: one page of the grid = every post except the featured one
export const digestGridQuery = groq`
  *[${POST_FILTER} && _id != $featuredId] | ${POST_NEWEST_FIRST}[$from...$to]{${POST_CARD}}
`

// Detail page: one post by slug (body images carry their URL and size for next/image)
export const digestPostQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${POST_CARD},
    ${seoFragment},
    "body": body[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        alt,
        caption
      }
    }
  }
`
export const newsletterQuery = groq`
  *[_type == "home"][0]{
    "heading": newsletterHeading,
    "subtitle": newsletterSubtitle,
    "backgroundType": newsletterBackgroundType,
    "image": newsletterBackgroundImage.asset->url,
    "imageAlt": newsletterBackgroundImage.alt,
    "hotspot": newsletterBackgroundImage.hotspot{x, y},
    "videoUrl": coalesce(newsletterBackgroundVideoFile.asset->url, newsletterBackgroundVideoUrl)
  }
`
// ---------------------------------------------------------------------------
// Contact Us: ONE Studio document ("Contact Us") feeds both the Home page
// "Have an Enquiry?" section and the /contact-us page.
export const contactQuery = groq`
  *[_type == "contact"][0]{
    heading,
    description,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "heroHotspot": heroImage.hotspot{x, y},
    generalEmail,
    reportEmail
  }
`
// ---------------------------------------------------------------------------
// Global footer (singleton "Footer" document), rendered on every page
export const footerQuery = groq`
  *[_type == "footer"][0]{
    "logo": logo.asset->url,
    "logoAlt": logo.alt,
    description,
    socialLinks[]{platform, label, url},
    indexTitle,
    indexLinks[]{label, url},
    servicesTitle,
    serviceLinks[]{label, url},
    copyright,
    legalLinks[]{label, url}
  }
`
// ---------------------------------------------------------------------------
// About Us page (singleton "About Us" document)
export const aboutQuery = groq`
  *[_type == "about"][0]{
    heroHeadingWhite,
    heroHeadingBlue,
    heroDescription,
    heroButtonText,
    heroButtonLink,
    "heroBackground": heroBackground.asset->url,
    "heroBackgroundAlt": heroBackground.alt,
    "heroHotspot": heroBackground.hotspot{x, y},

    peopleHeading,
    peopleDescription,
    "peopleImage": peopleImage.asset->url,
    "peopleImageAlt": peopleImage.alt,

    journeyHeading,
    journey[]{_key, year, title, description},

    clientsHeading,
    clientsSubtitle,
    clients[]{_key, name, url, "logo": logo.asset->url},

    testimonialsHeading,
    testimonialsSubtitle,
    testimonials[]{_key, quote, author, position, company}
  }
`
// ---------------------------------------------------------------------------
// Our Technology page (singleton "Our Technology" document)
export const ourTechnologyQuery = groq`
  *[_type == "ourTechnology"][0]{
    heroEyebrow,
    heroHeadingWhite,
    heroHeadingBlue,
    heroDescription,
    "heroBackground": heroBackground.asset->url,
    "heroBackgroundAlt": heroBackground.alt,
    "heroHotspot": heroBackground.hotspot{x, y},

    introEyebrow,
    introHeading,
    introDescription,

    "pillars": pillars[defined(image.asset)]{
      _key,
      title,
      description,
      "image": image.asset->url,
      "imageAlt": image.alt,
      "hotspot": image.hotspot{x, y}
    }
  }
`
// ---------------------------------------------------------------------------
// Services: "Services Page" singleton + one "service" document per solution
export const servicesPageQuery = groq`
  *[_type == "servicesPage"][0]{
    heroTitle,
    heroSubtitle,
    "heroBackground": heroBackground.asset->url,
    "heroBackgroundAlt": heroBackground.alt,
    "heroHotspot": heroBackground.hotspot{x, y},
    introHeading,
    introDescription,
    exploreLabel,
    whyChooseHeading,
    whyChooseItems[]{_key, title, description, "icon": coalesce(icon.asset->url, icon)},
    benefits[]{
      _key,
      title,
      description,
      "icon": coalesce(icon.asset->url, icon)
    },
    coverItems[]{_key, title, description, "icon": coalesce(icon.asset->url, icon)}
  }
`

const SERVICE_CARD = `
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  features,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "hotspot": image.hotspot{x, y}
`

const SERVICE_ORDER = `order(coalesce(order, 999) asc, title asc)`

// /services listing
export const servicesListQuery = groq`
  *[_type == "service" && defined(slug.current)] | ${SERVICE_ORDER}{${SERVICE_CARD}}
`

// Header dropdown + "other solutions": only what a small card needs
export const servicesMenuQuery = groq`
  *[_type == "service" && defined(slug.current)] | ${SERVICE_ORDER}{
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`

// /services/[slug]
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    ${SERVICE_CARD},
    ${seoFragment},

    heroTitleWhite,
    heroTitleBlue,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "heroHotspot": heroImage.hotspot{x, y},

    keyFeaturesHeading,
    keyFeaturesIntro,
    keyFeatures[]{_key, tabLabel, title, description, "image": image.asset->url, "imageAlt": image.alt},

    whyHeading,
    whyText,
    whyPoints,
    "whyImage": whyImage.asset->url,
    "whyImageAlt": whyImage.alt,

    protectHeading,
    protectItems[]{_key, title, description, "image": image.asset->url, "imageAlt": image.alt},

    benefitsHeading,
    benefits[]{_key, title, description, "icon": coalesce(icon.asset->url, icon)},

    coverHeading,
    coverIntro,
    coverItems[]{_key, title, description, "icon": coalesce(icon.asset->url, icon)},

    ctaEyebrow,
    ctaHeading,
    ctaText,
    ctaButtonLabel,
    ctaLink,
    whyChooseHeading,
    whyChooseItems[]{_key, title, description, "icon": coalesce(icon.asset->url, icon)},
    faqHeading,
    faqs[]{_key, question, answer}
  }
`

// For generateStaticParams
export const serviceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)] | ${SERVICE_ORDER}{"slug": slug.current}
`
// Slugs for generateStaticParams on /digital-digest/[slug]
export const digestSlugsQuery = groq`
  *[${POST_FILTER}] | ${POST_NEWEST_FIRST}{"slug": slug.current}
`