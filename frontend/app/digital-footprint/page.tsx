import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import { manrope } from "@/app/fonts";
import {
  LinkedInFollowButton,
  LinkedInPostCard,
  type LinkedInPost,
} from "@/components/linkedin";
import { getFootprintPage } from "@/sanity/lib/getFootprint";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("digitalFootprintPage");
  return buildMetadata({
    seo: page?.seo,
    path: "/digital-footprint",
    fallback: {
      title: "Digital Footprint | Copyright Integrity International",
      description:
        "Our presence and influence across the digital landscape: the latest posts from Copyright Integrity on LinkedIn.",
    },
  });
}

export default async function DigitalFootprintPage() {
  // The "Digital Footprint Page" document may not be published yet: fall back to the
  // built-in defaults below instead of showing an error page.
  const data = (await getFootprintPage()) ?? {};

  // Every post from the "Digital Footprint Page" document, newest first
  // (the Home page section shows the 3 newest of this same list)
  const posts: LinkedInPost[] = (data.posts ?? []).filter((p: LinkedInPost) =>
    p?.text?.trim(),
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0C225E]">
          {data.heroImage && (
            <Image
              src={data.heroImage}
              alt={data.heroImageAlt || ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          {/* navy tint keeps the white text readable on any photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B215C]/95 via-[#0E2662]/90 to-[#0E2662]/80" />

          <div className="relative z-10 mx-auto max-w-[1338px] px-6 pb-20 pt-36 lg:px-12 lg:pb-[7.2rem] lg:pt-[7.625rem]">
            <h1
              className={`${manrope.className} text-5xl font-bold leading-[1.05] tracking-[-0.008em] text-white lg:text-[4rem]`}
            >
              {data.title || "Our Digital Footprint."}
            </h1>
            <p className="mt-6 max-w-[560px] text-[15.5px] leading-[1.7] text-white/70">
              {data.intro ||
                "Tracking our presence and influence across the digital landscape — insights, commentary and thought leadership from Copyright Integrity."}
            </p>
          </div>
        </section>

        {/* All LinkedIn posts */}
        <FadeInWhenVisible>
          <section
            aria-labelledby="latest-posts-heading"
            className="bg-white py-16 lg:py-20"
          >
            <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="latest-posts-heading"
                    className={`${manrope.className} text-3xl font-bold leading-[1.1] tracking-normal text-[#081F5C] lg:text-[2.55rem]`}
                  >
                    {data.heading || "Latest from LinkedIn"}
                  </h2>
                  <p className="mt-2.5 text-[15px] text-[#2A4879]">
                    {data.subtitle ||
                      "Follow Copyright Integrity for the latest updates on IP protection and digital rights."}
                  </p>
                </div>

                <LinkedInFollowButton
                  href={data.buttonLink}
                  label={data.buttonText}
                  variant="page"
                />
              </div>

              {posts.length > 0 ? (
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-[4.42rem] lg:grid-cols-3">
                  {posts.map((post) => (
                    <LinkedInPostCard
                      key={post._key}
                      post={post}
                      variant="page"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-12 text-[#2A4879]">
                  New posts will appear here soon.
                </p>
              )}
            </div>
          </section>
        </FadeInWhenVisible>
      </main>
    </>
  );
}
