import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {footerQuery} from './queries'

// Cached like the other fetchers; busted by the "footer" tag
// (see app/api/revalidate/route.ts).
export async function getFooter() {
  'use cache'
  cacheLife('minutes')
  cacheTag('footer')

  return client.fetch(footerQuery)
}