import {createClient} from 'next-sanity'

// Server-only client that WRITES subscribers into the private "newsletter" dataset.
// Never import this file from a "use client" component: it carries a secret token.
export const newsletterClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_NEWSLETTER_DATASET || 'newsletter',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})