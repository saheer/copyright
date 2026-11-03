import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {
  digestFeaturedQuery,
  digestGridQuery,
  digestHomeQuery,
  digestPostQuery,
  digestSlugsQuery,
} from './queries'

// Same pattern as getHome / getFootprint: cached on the server, refreshed every few
// minutes, or instantly when the "digitalDigest" tag is revalidated
// (see app/api/revalidate/route.ts).

// Number of cards in the grid of ONE listing page (the featured post is extra, and
// only shown on page 1)
export const DIGEST_PAGE_SIZE = 9

// Home page section: the 3 newest posts
export async function getDigestHome() {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalDigest')

  return client.fetch(digestHomeQuery)
}

// Listing page: the featured post and the total number of posts
export async function getDigestFeatured() {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalDigest')

  return client.fetch(digestFeaturedQuery)
}

// Listing page: the grid cards of one page (page numbers start at 1)
export async function getDigestGrid(featuredId: string | null, page: number) {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalDigest')

  const from = (page - 1) * DIGEST_PAGE_SIZE
  return client.fetch(digestGridQuery, {
    featuredId: featuredId ?? '',
    from,
    to: from + DIGEST_PAGE_SIZE,
  })
}

// Detail page: one full post, or null when the slug doesn't exist
export async function getDigestPost(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalDigest')

  return client.fetch(digestPostQuery, {slug})
}

// All slugs, for generateStaticParams
export async function getDigestSlugs(): Promise<{slug: string}[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('digitalDigest')

  return client.fetch(digestSlugsQuery)
}
