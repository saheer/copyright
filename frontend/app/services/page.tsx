import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import ServiceListItem from "@/components/ServiceListItem";
import { manrope } from "@/app/fonts";
import { getServicesList, getServicesPage } from "@/sanity/lib/getServices";
import { hotspotStyle } from "@/lib/services";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("servicesPage");
  return buildMetadata({
    seo: page?.seo,
    path: "/services",
    fallback: {
      title: "Services | Copyright Integrity International",
      description:
        "Live stream anti-piracy, video and mobile content protection, brand protection, and research and advisory services.",
    },
  });
}

export default async function ServicesPage() {
  const [pageData, list] = await Promise.all([
    getServicesPage(),
    getServicesList(),
  ]);
  // Works even before the "Services Page" document is published
  const page = pageData ?? {};
  const services = Array.isArray(list) ? list : [];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#031236]">
          {page.heroBackground && (
            <Image
              src={page.heroBackground}
              alt={page.heroBackgroundAlt || ""}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              style={hotspotStyle(page.heroHotspot)}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020D2B]/90 via-[#031236]/75 to-[#031236]/50" />

          <div className="relative z-10 mx-auto max-w-[1338px] px-6 pb-20 pt-40 lg:px-12 lg:pb-28 lg:pt-[11rem]">
            <h1
              className={`${manrope.className} max-w-[860px] animate-fade-up text-5xl font-bold leading-[1.05] tracking-[-0.015em] text-white motion-reduce:animate-none sm:text-6xl lg:text-[4.5rem]`}
            >
              {page.heroTitle ||
                "Protecting rights across a borderless digital environment."}
            </h1>
            <p
              style={{ animationDelay: "150ms" }}
              className="mt-8 max-w-[640px] animate-fade-up text-base leading-[1.75] text-white/80 motion-reduce:animate-none"
            >
              {page.heroSubtitle ||
                "Our monitoring, investigation and enforcement work spans major markets across every continent — wherever digital content is created, distributed and consumed."}
            </p>
          </div>
        </section>

        {/* Intro + the four services */}
        <FadeInWhenVisible>
          <section className="bg-white py-16 lg:py-24">
            <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
                <h2
                  className={`${manrope.className} max-w-[640px] text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3rem]`}
                >
                  {page.introHeading ||
                    "Stay One Step Ahead of IP Infringement"}
                </h2>
                {page.introDescription && (
                  <p className="max-w-[400px] text-[15px] leading-[1.6] text-[#1E3A72] lg:pb-2">
                    {page.introDescription}
                  </p>
                )}
              </div>

              {services.length === 0 ? (
                <p className="mt-12 text-[#2A4879]">
                  Services will appear here once they are published in Sanity
                  Studio.
                </p>
              ) : (
                <div className="mt-10 space-y-6 lg:mt-12">
                  {services.map((s, i) => (
                    <ServiceListItem
                      key={s._id}
                      service={s}
                      reversed={i % 2 === 1}
                      exploreLabel={page.exploreLabel}
                      priority={i === 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </FadeInWhenVisible>
      </main>
    </>
  );
}
