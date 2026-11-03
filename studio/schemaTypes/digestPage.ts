import {defineField, defineType} from 'sanity'

// The /digital-digest listing page has no editable content of its own,
// so this singleton only holds its SEO settings.
export default defineType({
  name: 'digestPage',
  title: 'Digital Digest Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Digital Digest Page',
      readOnly: true,
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'Digital Digest Page'})},
})
