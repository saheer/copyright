import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton: everything on the /about-us page.
export default defineType({
  name: 'about',
  title: 'About Us',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'people', title: 'Our People'},
    {name: 'journey', title: 'Our Journey'},
    {name: 'clients', title: 'Trusted Clients'},
    {name: 'testimonials', title: 'Client Speak'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---------- Hero ----------
    defineField({
      name: 'heroHeadingWhite',
      title: 'Heading (white part)',
      type: 'string',
      group: 'hero',
      initialValue: 'Intelligence That Protects',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroHeadingBlue',
      title: 'Heading (blue part)',
      type: 'string',
      group: 'hero',
      initialValue: 'Your Digital Assets',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Subheading / description',
      type: 'text',
      rows: 4,
      group: 'hero',
      initialValue:
        'Copyright Integrity International is a leading online rights protection agency with over 17 years of experience. We combine advanced technology, legal expertise, and a global enforcement network to detect, combat, and deter digital piracy — protecting your content and sustaining your revenue.',
    }),
    defineField({
      name: 'heroBackground',
      title: 'Background image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
      description: 'A dark blue tint is added automatically so the text stays readable.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Button text',
      type: 'string',
      group: 'hero',
      initialValue: 'Learn About Our Approach',
    }),
    defineField({
      name: 'heroButtonLink',
      title: 'Button link',
      type: 'string',
      group: 'hero',
      description: 'A page (/our-technology), a section on this page (#our-journey) or a full https:// link.',
      initialValue: '#our-journey',
    }),

    // ---------- Our People ----------
    defineField({
      name: 'peopleHeading',
      title: 'Heading',
      type: 'string',
      group: 'people',
      initialValue: 'Our People',
    }),
    defineField({
      name: 'peopleDescription',
      title: 'Paragraphs',
      type: 'array',
      group: 'people',
      of: [defineArrayMember({type: 'text', rows: 3})],
      initialValue: [
        'Collectively, Integrity has over 120 years of experience handling digital anti-piracy spanning the last 18 years.',
        'With diverse expertise, each individual brings professionalism and skills that include digital and cyber forensics, legal enforcement, IP litigation support and IP enforcement.',
      ],
    }),
    defineField({
      name: 'peopleImage',
      title: 'Image / graphic',
      type: 'image',
      group: 'people',
      options: {hotspot: true},
      description: 'Shown on the right, in a 16:9 rounded frame.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),

    // ---------- Our Journey ----------
    defineField({
      name: 'journeyHeading',
      title: 'Heading',
      type: 'string',
      group: 'journey',
      initialValue: 'Our Journey',
    }),
    defineField({
      name: 'journey',
      title: 'Timeline items',
      type: 'array',
      group: 'journey',
      description: 'Shown left to right (4 fit in one row). Drag to reorder.',
      of: [
        defineArrayMember({
          name: 'milestone',
          type: 'object',
          fields: [
            defineField({name: 'year', title: 'Year', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'year'}},
        }),
      ],
      initialValue: [
        {
          _type: 'milestone',
          year: '2007',
          title: 'Founded',
          description:
            'Established as a specialist IP rights protection agency focused on digital content.',
        },
        {
          _type: 'milestone',
          year: '2012',
          title: 'Global Reach',
          description:
            'Expanded operations across key markets in Europe, Asia-Pacific and the Americas.',
        },
        {
          _type: 'milestone',
          year: '2018',
          title: 'Technology',
          description:
            'Integrated advanced detection technology with human intelligence and legal expertise.',
        },
        {
          _type: 'milestone',
          year: '2024',
          title: 'Today',
          description:
            'A trusted global agency protecting rights holders across every digital environment.',
        },
      ],
    }),

    // ---------- Trusted clients ----------
    defineField({
      name: 'clientsHeading',
      title: 'Heading',
      type: 'string',
      group: 'clients',
      initialValue: 'Trusted to protect what matters.',
    }),
    defineField({
      name: 'clientsSubtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'clients',
      initialValue:
        'We work with leading rights holders, broadcasters, sports organisations, entertainment companies and global brands.',
    }),
    defineField({
      name: 'clients',
      title: 'Client logos',
      type: 'array',
      group: 'clients',
      description: 'Shown in a grid of white cards (3 per row on desktop). Drag to reorder.',
      of: [
        defineArrayMember({
          name: 'client',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Client name',
              type: 'string',
              description: 'Used as the logo’s alt text.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo (SVG or PNG)',
              type: 'image',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Website (optional)',
              type: 'url',
              description: 'If set, the card becomes a link that opens in a new tab.',
              validation: (r) => r.uri({scheme: ['https', 'http']}),
            }),
          ],
          preview: {select: {title: 'name', media: 'logo'}},
        }),
      ],
    }),

    // ---------- Client Speak ----------
    defineField({
      name: 'testimonialsHeading',
      title: 'Heading',
      type: 'string',
      group: 'testimonials',
      initialValue: 'Client Speak',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'testimonials',
      initialValue: 'Testimonials from our clients.',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      description: 'Shown one at a time in the slider. Drag to reorder.',
      of: [
        defineArrayMember({
          name: 'testimonial',
          type: 'object',
          fields: [
            defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required()}),
            defineField({
              name: 'author',
              title: 'Author name (optional)',
              type: 'string',
              description: 'Leave empty to show only the role and company, as in the design.',
            }),
            defineField({name: 'position', title: 'Designation', type: 'string'}),
            defineField({name: 'company', title: 'Company', type: 'string'}),
          ],
          preview: {select: {title: 'company', subtitle: 'quote'}},
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About Us'})},
})