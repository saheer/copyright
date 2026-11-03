import {defineField, defineType} from 'sanity'

// Singleton "Our Technology" page (one document, ID "ourTechnology").
export default defineType({
  name: 'ourTechnology',
  title: 'Our Technology',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'intro', title: 'Section header'},
    {name: 'pillars', title: 'Technology pillars'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Our Technology',
      readOnly: true,
    }),

    // ---------- Hero ----------
    defineField({
      name: 'heroEyebrow',
      title: 'Badge (small label)',
      type: 'string',
      group: 'hero',
      initialValue: 'Our Technology',
    }),
    defineField({
      name: 'heroHeadingWhite',
      title: 'Heading (white part)',
      type: 'string',
      group: 'hero',
      initialValue: 'Technology built for',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroHeadingBlue',
      title: 'Heading (blue part)',
      type: 'string',
      group: 'hero',
      initialValue: 'decisive rights protection.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue:
        'CII combines advanced detection technology, structured intelligence and human expertise to identify infringement, verify risk and support effective enforcement.',
    }),
    defineField({
      name: 'heroBackground',
      title: 'Background image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
      description: 'Wide image (about 2400 × 1200). A navy tint is added automatically.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),

    // ---------- Section header ----------
    defineField({
      name: 'introEyebrow',
      title: 'Small label',
      type: 'string',
      group: 'intro',
      initialValue: 'Human × Technology',
    }),
    defineField({
      name: 'introHeading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      group: 'intro',
      description: 'Press Enter to start a new line.',
      initialValue: 'Machine-scale intelligence.\nHuman-led decisions.',
    }),
    defineField({
      name: 'introDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'intro',
      description: 'Shown on the right of the heading.',
      initialValue:
        'Our connected protection model combines the speed and scale of technology with specialist judgement, moving from discovery to evidence and enforcement.',
    }),

    // ---------- Pillars ----------
    defineField({
      name: 'pillars',
      title: 'Technology pillars',
      type: 'array',
      group: 'pillars',
      description:
        'One row per pillar. Rows alternate automatically: image left, image right, image left… Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'pillar',
          title: 'Pillar',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'image',
              title: 'Feature image',
              type: 'image',
              options: {hotspot: true},
              description: 'Landscape image, about 1600 × 900. Use the hotspot to pick the focus area.',
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  description: 'Describe the image (leave empty if purely decorative).',
                }),
              ],
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
        },
      ],
      validation: (r) => r.min(1).max(10),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Our Technology'})},
})
