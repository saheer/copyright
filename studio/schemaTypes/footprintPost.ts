import {defineField, defineType} from 'sanity'

// One LinkedIn post card. All posts live in ONE list on the "Digital Footprint Page"
// document: that page shows every post, the Home page shows the 3 newest.
//
// IMPORTANT: keep the name 'footprintPost'. It is the `_type` already stored on posts
// that were entered before, so renaming it would make Studio report them as invalid.
export default defineType({
  name: 'footprintPost',
  title: 'LinkedIn post',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Post text',
      type: 'text',
      rows: 5,
      description: 'Copy the post text from LinkedIn. Line breaks are kept; hashtags can be typed as normal text.',
      validation: (r) => [
        r.required(),
        r.max(400).warning('Keep it under about 400 characters so the cards stay even'),
      ],
    }),
    defineField({
      name: 'postedAt',
      title: 'Date posted',
      type: 'datetime',
      description:
        'Decides which posts are the newest: the Home page shows the 3 newest, and the Digital Footprint page lists newest first (the order of this list does not matter). It is set to “now” when you add a post, so only change it when entering an older post.',
      options: {dateFormat: 'DD MMM YYYY', timeFormat: 'HH:mm'},
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'timeAgo',
      title: 'Time label on the card',
      type: 'string',
      description: 'Shown on the card exactly as typed, the way LinkedIn shows it, e.g. 2d, 3w or 2 days ago',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'reposts',
      title: 'Reposts',
      type: 'number',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'url',
      title: 'LinkedIn post URL',
      type: 'url',
      description: 'Link used by “View post”. If left empty, the link is hidden.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
  ],
  preview: {select: {title: 'text', subtitle: 'timeAgo'}},
})
