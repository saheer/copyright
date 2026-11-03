import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {footprintHomeQuery, footprintPageQuery} from './queries'

// Both functions read the SAME Sanity document ("Digital Footprint Page"), so they
// share one cache tag. The webhook route (app/api/revalidate/route.ts) refreshes this
// tag, and even without a webhook the "minutes" profile revalidates the data about a
// minute after a visit.

// Home page section: its own heading/subtitle + the 3 newest posts
export async function getFootprintHome() {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalFootprintPage')

  return client.fetch(footprintHomeQuery)
}

// Full /digital-footprint page: hero + every post, newest first
export async function getFootprintPage() {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalFootprintPage')

  return client.fetch(footprintPageQuery)
}
