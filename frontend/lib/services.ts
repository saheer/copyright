// Shared by the header dropdown, the /services page and the detail pages.

export type Hotspot = { x: number; y: number } | null | undefined;

export type ServiceMenuItem = {
  _id: string;
  title: string;
  slug: string;
  image?: string | null;
  imageAlt?: string | null;
};

export type ServiceCardData = ServiceMenuItem & {
  shortDescription?: string | null;
  features?: string[] | null;
  hotspot?: Hotspot;
};

// Used by the header dropdown until the services are published in Sanity
export const SERVICES_FALLBACK: ServiceMenuItem[] = [
  { _id: "fallback-1", title: "Live Stream Anti-Piracy Protection", slug: "live-stream-anti-piracy-protection" },
  { _id: "fallback-2", title: "Video & Mobile Content Protection", slug: "video-mobile-content-protection" },
  { _id: "fallback-3", title: "Brand Protection", slug: "brand-protection" },
  { _id: "fallback-4", title: "Research & Advisory Services", slug: "research-advisory-services" },
];


// Sanity hotspot -> CSS object-position, so the chosen focal point survives cropping
export function hotspotStyle(h: Hotspot) {
  return h ? { objectPosition: `${h.x * 100}% ${h.y * 100}%` } : undefined;
}