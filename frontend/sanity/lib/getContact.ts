import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {contactQuery} from './queries'

// Cached like the other fetchers; busted by the "contact" tag
// (see app/api/revalidate/route.ts).
export async function getContact() {
  'use cache'
  cacheLife('minutes')
  cacheTag('contact')

  return client.fetch(contactQuery)
}