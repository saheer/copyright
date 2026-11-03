import {defineField, defineType} from 'sanity'

// Singleton: feeds BOTH the "Have an Enquiry?" section on the Home page and the
// /contact-us page (hero + contact details).
export default defineType({
  name: 'contact',
  title: 'Contact Us',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Have an Enquiry?',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Would you like to learn more about our services or report an infringement? Please fill in the appropriate form and we will get back to you shortly.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Contact page hero background image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Shown behind the heading on the Contact page. A dark blue tint is added automatically so the text stays readable.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'generalEmail',
      title: 'General enquiries email (shown on the site)',
      type: 'string',
      initialValue: 'hello@copyrightintegrity.com',
      description:
        'Display only. Where submitted enquiries are delivered is set in the website environment variables.',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'reportEmail',
      title: 'Report piracy email (shown on the site)',
      type: 'string',
      initialValue: 'report@copyrightintegrity.com',
      description: 'Display only (see above).',
      validation: (r) => r.email(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'Contact Us'})},
})