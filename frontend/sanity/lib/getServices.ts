import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {
  serviceBySlugQuery,
  serviceSlugsQuery,
  servicesListQuery,
  servicesMenuQuery,
  servicesPageQuery,
} from './queries'

// Same pattern as the other fetchers: cached, refreshed every few minutes, or
// instantly when the "services" tag is revalidated (see app/api/revalidate/route.ts).

export async function getServicesPage() {
  'use cache'
  cacheLife('minutes')
  cacheTag('services')
  return client.fetch(servicesPageQuery)
}

export async function getServicesList() {
  'use cache'
  cacheLife('minutes')
  cacheTag('services')
  return client.fetch(servicesListQuery)
}

// Header dropdown and "other solutions" cards
export async function getServicesMenu() {
  'use cache'
  cacheLife('minutes')
  cacheTag('services')
  return client.fetch(servicesMenuQuery)
}

// One service, or null when the slug doesn't exist
export async function getService(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('services')
  return client.fetch(serviceBySlugQuery, {slug})
}

export async function getServiceSlugs(): Promise<{slug: string}[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('services')
  return client.fetch(serviceSlugsQuery)
}