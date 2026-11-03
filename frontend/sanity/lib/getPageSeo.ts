import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import { pageSeoQuery } from "./queries";
import type { SeoData } from "./seo";

/**
 * SEO fields of a one-document page, e.g. getPageSeo('about').
 * Cached like the other fetchers and refreshed by the "seo" tag
 * (see app/api/revalidate/route.ts).
 */
export async function getPageSeo(
  type: string,
): Promise<{ seo: SeoData } | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("seo");

  return client.fetch(pageSeoQuery, { type });
}
