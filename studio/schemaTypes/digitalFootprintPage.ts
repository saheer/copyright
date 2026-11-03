import {defineField, defineType} from 'sanity'

// The ONE place to manage "Digital Footprint" for the whole site (singleton: fixed ID,
// no create/delete, see sanity.config.ts). It feeds two places:
//   - the /digital-footprint page: hero + all LinkedIn posts, newest first
//   - the Home page section "Our Digital Footprint": its own heading/subtitle + the
//     3 newest posts from the same list
export default defineType({
  name: 'digitalFootprintPage',
  title: 'Digital Footprint Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Page hero', default: true},
    {name: 'section', title: 'Page: posts section'},
    {name: 'home', title: 'Home page section'},
    {name: 'posts', title: 'LinkedIn posts'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---------- /digital-footprint page: hero ----------
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      group: 'hero',
      initialValue: 'Our Digital Footprint.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero description',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue:
        'Tracking our presence and influence across the digital landscape — insights, commentary and thought leadership from Copyright Integrity.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero background image',
      type: 'image',
      group: 'hero',
      description: 'Optional. Shown behind a dark blue tint; a plain navy background is used if empty.',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),

    // ---------- /digital-footprint page: posts section ----------
    defineField({
      name: 'postsHeading',
      title: 'Section heading',
      type: 'string',
      group: 'section',
      initialValue: 'Latest from LinkedIn',
    }),
    defineField({
      name: 'postsSubtitle',
      title: 'Section subtitle',
      type: 'string',
      group: 'section',
      initialValue: 'Follow Copyright Integrity for the latest updates on IP protection and digital rights.',
    }),

    // ---------- Home page: "Our Digital Footprint" section ----------
    defineField({
      name: 'homeHeading',
      title: 'Home page: section heading',
      type: 'string',
      group: 'home',
      description: 'The posts shown there are the 3 newest from the “LinkedIn posts” tab.',
      initialValue: 'Our Digital Footprint',
    }),
    defineField({
      name: 'homeSubtitle',
      title: 'Home page: section subtitle',
      type: 'string',
      group: 'home',
      initialValue: 'Follow Copyright Integrity and Make an impression',
    }),

    // ---------- LinkedIn posts (shared by the page and the Home page) ----------
    defineField({
      name: 'buttonText',
      title: 'Follow button text (Home page + this page)',
      type: 'string',
      group: 'posts',
      initialValue: 'Follow Us on LinkedIn',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Follow button link (LinkedIn company page)',
      type: 'url',
      group: 'posts',
      initialValue: 'https://www.linkedin.com/company/copyright-integrity-international/posts/',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'posts',
      title: 'LinkedIn posts',
      type: 'array',
      group: 'posts',
      description:
        'One list for the whole site. The Digital Footprint page shows all of these, newest first; the Home page shows only the 3 newest. “Newest” is decided by each post’s “Date posted” (set to now when you add a post), so the order of this list does not matter. Posts with no date are treated as oldest.',
      of: [{type: 'footprintPost'}],
      validation: (r) => r.min(1),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Digital Footprint Page'})},
})
