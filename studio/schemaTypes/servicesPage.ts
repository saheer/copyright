import {defineArrayMember, defineField, defineType} from 'sanity'
import {createElement} from 'react'
import {InlineSvgPreviewItem} from '@focus-reactive/sanity-plugin-inline-svg-input'
// Singleton: texts of the /services listing page, plus the "Why Choose Copyright
// Integrity" block that is shown on every service detail page.
export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  groups: [
    {name: 'listing', title: 'Services listing page', default: true},
    {name: 'whyChoose', title: 'Shared: Why Choose (all service pages)'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      group: 'listing',
      initialValue: 'Protecting rights across a borderless digital environment.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 3,
      group: 'listing',
      initialValue:
        'Our monitoring, investigation and enforcement work spans major markets across every continent — wherever digital content is created, distributed and consumed.',
    }),
    defineField({
      name: 'heroBackground',
      title: 'Hero background image',
      type: 'image',
      group: 'listing',
      options: {hotspot: true},
      description: 'A dark navy tint is added automatically so the text stays readable.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'introHeading',
      title: 'Intro heading (above the cards)',
      type: 'string',
      group: 'listing',
      initialValue: 'Stay One Step Ahead of IP Infringement',
    }),
    defineField({
      name: 'introDescription',
      title: 'Intro description',
      type: 'text',
      rows: 3,
      group: 'listing',
      initialValue:
        'Modern IP protection requires a proactive protection strategy requiring a combined framework of legal and technical barriers to protect rights holders effectively.',
    }),
    defineField({
      name: 'exploreLabel',
      title: '"Explore" link text on each card',
      type: 'string',
      group: 'listing',
      initialValue: 'Explore Solution',
    }),

    // ---------- Shared on every service detail page ----------
    defineField({
      name: 'whyChooseHeading',
      title: 'Heading',
      type: 'string',
      group: 'whyChoose',
      initialValue: 'Why Choose Copyright Integrity',
    }),
    defineField({
      name: 'whyChooseItems',
      title: 'Strengths',
      type: 'array',
      group: 'whyChoose',
      description: 'Dark cards, 3 per row (6 fills two rows).',
      of: [
          defineArrayMember({
          name: 'strength',
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Icon (SVG)', type: 'inlineSvg'}),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({              name: 'description',              title: 'Description (optional)',              type: 'text',              rows: 2,              description: 'Shown under the title. Leave empty to match the design (title only).',            }),
          ],
          preview: {select: {icon: 'icon', title: 'title', subtitle: 'description'}},          components: {            preview: (p: any) =>              createElement(InlineSvgPreviewItem, {icon: p.icon, title: p.title, subtitle: p.subtitle}),          },
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Services Page'})},
})