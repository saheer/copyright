import {defineArrayMember, defineField, defineType} from 'sanity'

// Internal path (/about-us), anchor (#contact) or full link (https://, mailto:, tel:)
const urlValidation = (r: any) =>
  r.required().custom((value: string | undefined) =>
    !value || /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value)
      ? true
      : 'Use a path like /about-us or a full link starting with https://',
  )

// Reusable "list of text links" field (label + url)
const linkList = (
  name: string,
  title: string,
  initialValue: {label: string; url: string}[],
  description?: string,
) =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      defineArrayMember({
        name: 'link',
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
          defineField({name: 'url', title: 'Link', type: 'string', validation: urlValidation}),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      }),
    ],
    initialValue: initialValue.map((item) => ({_type: 'link', ...item})),
  })

// Singleton: the global footer shown at the bottom of every page.
export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Logo & Social', default: true},
    {name: 'links', title: 'Link Columns'},
    {name: 'bottom', title: 'Bottom Bar'},
  ],
  fields: [
    // ---------- Logo, description, social ----------
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'brand',
      description:
        'Optional. Leave empty to use the default logo. Use a light/white logo: the footer is dark navy.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'brand',
      initialValue:
        'Global Intellectual Property Rights Protection — Focused Intelligence. Meaningful Protection.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'brand',
      of: [
        defineArrayMember({
          name: 'social',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'X (Twitter)', value: 'x'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              initialValue: 'linkedin',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Button text',
              type: 'string',
              initialValue: 'LinkedIn',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Profile link',
              type: 'url',
              validation: (r) => r.required().uri({scheme: ['https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
      initialValue: [
        {
          _type: 'social',
          platform: 'linkedin',
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/company/copyright-integrity-international/',
        },
      ],
    }),

    // ---------- Link columns ----------
    defineField({
      name: 'indexTitle',
      title: 'Index column title',
      type: 'string',
      group: 'links',
      initialValue: 'Index',
    }),
    linkList('indexLinks', 'Index links', [
      {label: 'About Us', url: '/about-us'},
      {label: 'Services', url: '/services'},
      {label: 'Our Technology', url: '/our-technology'},
      {label: 'Digital Digest', url: '/digital-digest'},
      {label: 'Digital Footprint', url: '/digital-footprint'},
      {label: 'Contact Us', url: '/contact-us'},
    ]),
    defineField({
      name: 'servicesTitle',
      title: 'Services column title',
      type: 'string',
      group: 'links',
      initialValue: 'Services',
    }),
    linkList('serviceLinks', 'Services links', [
      {label: 'Live Stream Anti-Piracy', url: '/services'},
      {label: 'Video & Mobile Content', url: '/services'},
      {label: 'Brand Protection', url: '/services'},
      {label: 'Research & Advisory', url: '/services'},
    ]),

    // ---------- Bottom bar ----------
    defineField({
      name: 'copyright',
      title: 'Copyright text',
      type: 'string',
      group: 'bottom',
      initialValue: '© 2026 Copyright Integrity International. All rights reserved.',
    }),
    linkList('legalLinks', 'Legal links', [
      {label: 'Privacy Policy', url: '/privacy-policy'},
      {label: 'Terms & Conditions', url: '/terms-and-conditions'},
    ]),
  ].map((field) => {
    // put the two link-list fields into their groups
    if (['indexLinks', 'serviceLinks'].includes(field.name)) return {...field, group: 'links'}
    if (field.name === 'legalLinks') return {...field, group: 'bottom'}
    return field
  }),
  preview: {prepare: () => ({title: 'Footer'})},
})