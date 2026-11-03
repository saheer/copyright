import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {aboutQuery} from './queries'

// Cached like the other fetchers; busted by the "about" tag
// (see app/api/revalidate/route.ts).
export async function getAbout() {
  'use cache'
  cacheLife('minutes')
  cacheTag('about')

  return client.fetch(aboutQuery)
}