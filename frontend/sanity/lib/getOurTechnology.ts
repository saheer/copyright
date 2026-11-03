import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {ourTechnologyQuery} from './queries'

// Cached like the other fetchers; busted by the "ourTechnology" tag
// (see app/api/revalidate/route.ts).
export async function getOurTechnology() {
  'use cache'
  cacheLife('minutes')
  cacheTag('ourTechnology')

  return client.fetch(ourTechnologyQuery)
}
