import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {homeQuery, newsletterQuery} from './queries'

// Cached on the server and included in the prerendered shell.
// Re-fetched from Sanity at most every few minutes, or instantly
// when the "home" tag is revalidated (see app/api/revalidate/route.ts).
export async function getHome() {
  'use cache'
  cacheLife('minutes')
  cacheTag('home')

  return client.fetch(homeQuery)
}

// Newsletter banner (same "Home Page" document, so it shares the "home" tag).
export async function getNewsletter() {
  'use cache'
  cacheLife('minutes')
  cacheTag('home')

  return client.fetch(newsletterQuery)
}