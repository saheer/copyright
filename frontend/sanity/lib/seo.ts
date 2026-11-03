import type { Metadata } from "next";

export const SITE_NAME = "Copyright Integrity International";

// Public address of the site, used for canonical URLs and social images.
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.example.com).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Shape returned by the `seo` projection in sanity/lib/queries.ts */
export type SeoData = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  ogImage?: string | null;
  ogImageAlt?: string | null;
  ogHotspot?: { x: number; y: number } | null;
} | null;

type Fallback = {
  /** Used when "Meta title" is empty in Sanity */
  title: string;
  /** Used when "Meta description" is empty */
  description?: string | null;
  /** Used when no social sharing image is set (e.g. the post's main image) */
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
};

// Social networks want 1200 × 630. Sanity's image CDN can crop to that size
// (around the hotspot, when one is set), so editors can upload any size.
export function ogImageUrl(
  url: string,
  hotspot?: { x: number; y: number } | null,
) {
  if (!url.startsWith("https://cdn.sanity.io/")) return url;
  const params = new URLSearchParams({
    w: "1200",
    h: "630",
    fit: "crop",
    auto: "format",
  });
  if (hotspot) {
    params.set("crop", "focalpoint");
    params.set("fp-x", String(hotspot.x));
    params.set("fp-y", String(hotspot.y));
  }
  return `${url}?${params}`;
}

/**
 * Turns the Sanity SEO fields (plus fallbacks) into Next.js `Metadata`.
 * Anything left empty in Sanity falls back to `fallback`.
 */
export function buildMetadata({
  seo,
  fallback,
  path,
}: {
  seo?: SeoData;
  fallback: Fallback;
  /** Path of this page on the site, e.g. "/about-us" (used for the canonical URL) */
  path: string;
}): Metadata {
  const title = seo?.metaTitle?.trim() || fallback.title;
  const description =
    seo?.metaDescription?.trim() || fallback.description?.trim() || undefined;

  const hasOwnImage = !!seo?.ogImage;
  const imageSource = seo?.ogImage || fallback.image;
  const images = imageSource
    ? [
        {
          url: ogImageUrl(imageSource, hasOwnImage ? seo?.ogHotspot : null),
          width: 1200,
          height: 630,
          alt: (hasOwnImage && seo?.ogImageAlt) || title,
        },
      ]
    : undefined;

  const index = !seo?.noIndex;
  const follow = !seo?.noFollow;

  const openGraph = {
    type: fallback.type ?? "website",
    siteName: SITE_NAME,
    title,
    description,
    url: path,
    images,
    ...(fallback.type === "article" && fallback.publishedTime
      ? { publishedTime: fallback.publishedTime }
      : {}),
  } as NonNullable<Metadata["openGraph"]>;

  return {
    // `absolute`: the title is used exactly as typed in Sanity (no suffix added)
    title: { absolute: title },
    description,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: path },
    robots: { index, follow },
    openGraph,
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}
