import {defineField, defineType} from 'sanity'

/**
 * Reusable SEO object. Add it to any document with:
 *
 *   defineField({name: 'seo', title: 'SEO', type: 'seoFields'})
 */
export default defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        'The headline in Google results and the browser tab. Recommended: 50–60 characters. Leave empty to use the page’s default title.',
      validation: (r) => [
        r.max(60).warning('Over 60 characters – Google will probably cut the title off.'),
        r.min(30).warning('Under 30 characters – a little more detail usually ranks and clicks better.'),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'The summary under the title in Google results. Recommended: 120–160 characters. Leave empty to use the page’s default description.',
      validation: (r) => [
        r.max(160).warning('Over 160 characters – Google will probably cut the description off.'),
        r.min(70).warning('Under 70 characters – try to describe the page a little more.'),
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description:
        'Optional. Type a keyword and press Enter. Google ignores this tag, but some other search engines and tools still read it.',
      validation: (r) => r.max(10).warning('More than 10 keywords is not useful – keep the best ones.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image (Open Graph)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Shown when the page is shared on Facebook, LinkedIn, X/Twitter, WhatsApp and similar. Recommended: 1200 × 630 px. Use the hotspot to choose what stays in view when it is cropped.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image in a few words.',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to ask Google and others NOT to list this page in search results. Use for private, temporary or duplicate pages.',
    }),
    defineField({
      name: 'noFollow',
      title: 'Don’t follow links on this page (nofollow)',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to ask search engines not to follow the links on this page. Normally leave this off.',
    }),
  ],
})
