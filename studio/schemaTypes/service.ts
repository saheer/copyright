import {defineArrayMember, defineField, defineType} from 'sanity'
import {createElement} from 'react'
import {InlineSvgPreviewItem} from '@focus-reactive/sanity-plugin-inline-svg-input'
const altField = defineField({name: 'alt', title: 'Alt text', type: 'string'})

const imageWithAlt = (name: string, title: string, group?: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    // Fields nested inside an array item must NOT set a group: only the
    // document declares groups.
    ...(group ? {group} : {}),
    description,
    options: {hotspot: true},
    fields: [altField],
  })

// Small line icon (uploaded). Without one, the site shows a neutral default icon.
const iconField = defineField({
  name: 'icon',
  title: 'Icon (SVG)',
  type: 'inlineSvg',
  description:
    'Choose an .svg file. It is stored inside the document, with no image upload or CDN. Leave empty for the default icon.',
})

// Reusable "list of objects" field
const objectList = (
  name: string,
  title: string,
  group: string,
  memberName: string,
  fields: any[],
  previewSelect: Record<string, string>,
  description?: string,
  svgPreview = false,
) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    description,
    of: [
      defineArrayMember({
        name: memberName,
        type: 'object',
        fields,
        preview: {select: previewSelect},
        ...(svgPreview
          ? {
              components: {
                preview: (p: any) =>
                  createElement(InlineSvgPreviewItem, {
                    icon: p.icon,
                    title: p.title,
                    subtitle: p.subtitle,
                  }),
              },
            }
          : {}),
      }),
    ],
  })

const titleField = defineField({
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: (r) => r.required(),
})
const descField = (rows = 3) =>
  defineField({name: 'description', title: 'Description', type: 'text', rows})

// One document per service: feeds the /services cards, the header dropdown and the
// full /services/<slug> detail page.
export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'card', title: '1 · Card & Menu', default: true},
    {name: 'hero', title: '2 · Page hero'},
    {name: 'keyFeatures', title: '3 · Key Features (tabs)'},
    {name: 'why', title: '4 · Why do you need…'},
    {name: 'protect', title: '5 · What we protect'},
    {name: 'benefits', title: '6 · Benefits'},
    {name: 'cover', title: '7 · What we cover'},
    {name: 'cta', title: '8 · Call to action'},
    {name: 'whyChoose', title: '9 · Why Choose (optional override)'},
    {name: 'faq', title: '9 · FAQ'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---------- 1 · Card, menu and basics ----------
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'card',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (page address)',
      type: 'slug',
      group: 'card',
      description: 'The page will live at /services/<slug>.',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      group: 'card',
      description: '1 = first. Controls the order on /services and in the header menu.',
      initialValue: 1,
      validation: (r) => r.required().integer().min(1),
    }),
    {
      ...imageWithAlt(
        'image',
        'Featured image',
        'card',
        'Used on the /services card, in the header dropdown and as the page hero image unless a separate hero image is set.',
      ),
      validation: (r: any) => r.required(),
    },
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'card',
      description: 'Shown on the /services card and used as the page subtitle if no hero subtitle is set.',
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'features',
      title: 'Features (bullet list)',
      type: 'array',
      group: 'card',
      description:
        'The bullet list on the /services card AND the inline feature tags in the hero of the detail page. Drag to reorder.',
      of: [defineArrayMember({type: 'string'})],
    }),

    // ---------- 2 · Page hero ----------
    defineField({
      name: 'heroTitleWhite',
      title: 'Hero title (white part)',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Live Stream Anti-Piracy". Leave both parts empty to show the service title in white.',
    }),
    defineField({
      name: 'heroTitleBlue',
      title: 'Hero title (blue part)',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Protection". Shown on its own line in light blue.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Leave empty to use the short description.',
    }),
    imageWithAlt(
      'heroImage',
      'Hero background image (optional)',
      'hero',
      'A navy tint is added automatically. Leave empty to reuse the featured image.',
    ),

    // ---------- 3 · Key Features (tabs) ----------
    defineField({
      name: 'keyFeaturesHeading',
      title: 'Section heading',
      type: 'string',
      group: 'keyFeatures',
      initialValue: 'Key Features',
    }),
    defineField({
      name: 'keyFeaturesIntro',
      title: 'Intro text (right of the heading)',
      type: 'text',
      rows: 2,
      group: 'keyFeatures',
    }),
    objectList(
      'keyFeatures',
      'Tabs',
      'keyFeatures',
      'keyFeature',
      [
        defineField({
          name: 'tabLabel',
          title: 'Tab label',
          type: 'string',
          description: 'Also shown as the small label above the title, e.g. "24/7 Monitoring".',
          validation: (r) => r.required(),
        }),
        titleField,
        descField(4),
        imageWithAlt('image', 'Image'), // no group: nested fields can't use document groups
      ],
      {title: 'tabLabel', subtitle: 'title', media: 'image'},
      '3 tabs fit best. Drag to reorder.',
    ),

    // ---------- 4 · Why do you need… ----------
    defineField({
      name: 'whyHeading',
      title: 'Heading',
      type: 'string',
      group: 'why',
      description: 'Leave empty for "Why do you need <service title>?".',
    }),
    defineField({name: 'whyText', title: 'Text', type: 'text', rows: 4, group: 'why'}),
    defineField({
      name: 'whyPoints',
      title: 'Critical points (bullets)',
      type: 'array',
      group: 'why',
      of: [defineArrayMember({type: 'string'})],
    }),
    imageWithAlt('whyImage', 'Image', 'why'),

    // ---------- 5 · What we protect ----------
    defineField({
      name: 'protectHeading',
      title: 'Section heading',
      type: 'string',
      group: 'protect',
      initialValue: 'What we protect',
    }),
    objectList(
      'protectItems',
      'Cards',
      'protect',
      'protectItem',
      [titleField, descField(3), imageWithAlt('image', 'Image')], // no group here either
      {title: 'title', subtitle: 'description', media: 'image'},
      'Image cards, 4 per row.',
    ),

    // ---------- 6 · Benefits ----------
    defineField({
      name: 'benefitsHeading',
      title: 'Section heading',
      type: 'string',
      group: 'benefits',
      description: 'Leave empty for "How does <service title> benefit your brand?".',
    }),
    objectList(
      'benefits',
      'Benefit cards',
      'benefits',
      'benefit',
      [iconField, titleField, descField(3)],
      {icon: 'icon', title: 'title', subtitle: 'description'},
      'Dark cards, 4 per row.',
      true,
    ),

    // ---------- 7 · What we cover ----------
    defineField({
      name: 'coverHeading',
      title: 'Section heading',
      type: 'string',
      group: 'cover',
      initialValue: 'What we cover',
    }),
    defineField({
      name: 'coverIntro',
      title: 'Intro text (right of the heading)',
      type: 'text',
      rows: 2,
      group: 'cover',
    }),
    objectList(
      'coverItems',
      'Items',
      'cover',
      'coverItem',
      [
        iconField,
        titleField,
        defineField({
          name: 'description',
          title: 'Description (optional)',
          type: 'text',
          rows: 2,
        }),
      ],
      {icon: 'icon', title: 'title', subtitle: 'description'},
      'Icon cards, 4 per row (8 fills two rows).',
      true,
    ),

    // ---------- 8 · Call to action ----------
    defineField({
      name: 'ctaEyebrow',
      title: 'Small label',
      type: 'string',
      group: 'cta',
      initialValue: "Let's talk",
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Heading',
      type: 'string',
      group: 'cta',
      initialValue: 'Learn more about our services and pricing.',
    }),
    defineField({
      name: 'ctaText',
      title: 'Text',
      type: 'text',
      rows: 2,
      group: 'cta',
      initialValue:
        'Talk to our team to understand the right protection approach for your content and rights.',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'Button text',
      type: 'string',
      group: 'cta',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'string',
      group: 'cta',
      description: 'A page on this site (e.g. /contact-us) or a full https:// link.',
      initialValue: '/contact-us',
      validation: (r) =>
        r.custom(
          (v) =>
            !v || /^(\/|https?:\/\/)/.test(v) || 'Start with / for a page on this site, or https://',
        ),
    }),
        // ---------- 9 · Why Choose (optional: overrides the shared list) ----------
    defineField({
      name: 'whyChooseHeading',
      title: 'Heading (optional)',
      type: 'string',
      group: 'whyChoose',
      description: 'Leave empty to use the shared heading from Services Page.',
    }),
    objectList(
      'whyChooseItems',
      'Strengths (optional)',
      'whyChoose',
      'strength',
      [iconField, titleField, descField(2)],
      {icon: 'icon', title: 'title', subtitle: 'description'},
      'Leave EMPTY to show the shared list from Services Page. Fill it only to show different strengths on this service.',
      true, // inline-SVG preview: use the same last two arguments as your "Benefit cards" list
    ),
    // ---------- 9 · FAQ ----------
    defineField({
      name: 'faqHeading',
      title: 'Section heading',
      type: 'string',
      group: 'faq',
      initialValue: 'Frequently Asked Questions',
    }),
    objectList(
      'faqs',
      'Questions',
      'faq',
      'faq',
      [
        defineField({
          name: 'question',
          title: 'Question',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'answer',
          title: 'Answer',
          type: 'text',
          rows: 4,
          validation: (r) => r.required(),
        }),
      ],
      {title: 'question', subtitle: 'answer'},
      'The first question opens by default. Drag to reorder.',
    ),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [
    {title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'image'},
  },
})