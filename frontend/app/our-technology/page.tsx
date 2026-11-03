import type { Metadata } from "next";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import TechnologyHero from "@/components/TechnologyHero";
import TechnologyPillars from "@/components/TechnologyPillars";
import { getOurTechnology } from "@/sanity/lib/getOurTechnology";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("ourTechnology");
  return buildMetadata({
    seo: page?.seo,
    path: "/our-technology",
    fallback: {
      title: "Our Technology | Copyright Integrity International",
      description:
        "Advanced detection technology, structured intelligence and human expertise that identify infringement, verify risk and support effective enforcement.",
    },
  });
}

export default async function OurTechnologyPage() {
  const page = await getOurTechnology();

  if (!page) {
    return (
      <>
        <Header />
        <main className="p-10 pt-40">
          Our Technology content not found. Publish the “Our Technology”
          document in Sanity Studio.
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <TechnologyHero
          eyebrow={page.heroEyebrow}
          headingWhite={page.heroHeadingWhite}
          headingBlue={page.heroHeadingBlue}
          description={page.heroDescription}
          image={page.heroBackground}
          imageAlt={page.heroBackgroundAlt}
          hotspot={page.heroHotspot}
        />
        <FadeInWhenVisible>
          <TechnologyPillars
            eyebrow={page.introEyebrow}
            heading={page.introHeading}
            description={page.introDescription}
            pillars={page.pillars}
          />
        </FadeInWhenVisible>
      </main>
    </>
  );
}
