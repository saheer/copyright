import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import { manrope } from "@/app/fonts";
import { DigestCard, DigestFeaturedCard } from "@/components/DigestCard";
import DigestPagination from "@/components/DigestPagination";
import {
  DIGEST_PAGE_SIZE,
  getDigestFeatured,
  getDigestGrid,
} from "@/sanity/lib/getDigest";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("digestPage");
  return buildMetadata({
    seo: page?.seo,
    path: "/digital-digest",
    fallback: {
      title: "Digital Digest | Copyright Integrity International",
      description:
        "The latest insights on IP protection, digital piracy and brand protection as they emerge from the digital matrix.",
    },
  });
}

type SearchParams = Promise<{ page?: string | string[] }>;

// "?page=3" -> 3. Anything missing or invalid means page 1.
function parsePage(value?: string | string[]) {
  const n = Number.parseInt(
    Array.isArray(value) ? value[0] : (value ?? ""),
    10,
  );
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default function DigitalDigestPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <Header />
      <main>
        {/* Hero (static, prerendered) */}
        <section className="relative overflow-hidden bg-[#0C225E]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(47,99,181,0.45),transparent_60%),linear-gradient(to_right,#0B215C,#0E2662)]" />
          <div className="relative z-10 mx-auto max-w-[1338px] px-6 pb-20 pt-36 lg:px-12 lg:pb-[7.2rem] lg:pt-[7.625rem]">
            <h1
              className={`${manrope.className} text-5xl font-bold leading-[1.05] tracking-[-0.008em] text-white lg:text-[4rem]`}
            >
              Your Weekly Digital Digest.
            </h1>
            <p className="mt-6 max-w-[560px] text-[15.5px] leading-[1.7] text-white/70">
              For the latest insights on IP protection, digital piracy, brand
              protection as they emerge from the digital matrix.
            </p>
          </div>
        </section>

        {/* Posts: depends on ?page=, so it streams in behind a skeleton */}
        <FadeInWhenVisible>
          <section className="bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
              <Suspense fallback={<ListSkeleton />}>
                <DigestList searchParams={searchParams} />
              </Suspense>
            </div>
          </section>
        </FadeInWhenVisible>
      </main>
    </>
  );
}

async function DigestList({ searchParams }: { searchParams: SearchParams }) {
  const page = parsePage((await searchParams).page);
  const { featured, total } = await getDigestFeatured();

  if (!featured) {
    return (
      <p className="text-[#2A4879]">New insights will appear here soon.</p>
    );
  }

  // The featured post is not part of the grid
  const totalPages = Math.max(1, Math.ceil((total - 1) / DIGEST_PAGE_SIZE));
  if (page > totalPages) notFound();

  const posts = await getDigestGrid(featured._id, page);

  return (
    <>
      {/* Featured post: first page only */}
      {page === 1 && <DigestFeaturedCard post={featured} />}

      {posts.length > 0 && (
        <div
          className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            page === 1 ? "mt-8 lg:mt-16" : ""
          }`}
        >
          {posts.map((post: Parameters<typeof DigestCard>[0]["post"]) => (
            <DigestCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <DigestPagination page={page} totalPages={totalPages} />
    </>
  );
}

function ListSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-8">
      <div className="h-[428px] rounded-3xl bg-[#EEF1F6]" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[380px] rounded-2xl bg-[#EEF1F6]" />
        ))}
      </div>
    </div>
  );
}
