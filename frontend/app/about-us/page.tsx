import type { Metadata } from "next";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import AboutHero from "@/components/AboutHero";
import AboutPeopleSection from "@/components/AboutPeopleSection";
import JourneySection from "@/components/JourneySection";
import TrustedClientsSection from "@/components/TrustedClientsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getAbout } from "@/sanity/lib/getAbout";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("about");
  return buildMetadata({
    seo: page?.seo,
    path: "/about-us",
    fallback: {
      title: "About Us | Copyright Integrity International",
      description:
        "A leading online rights protection agency with over 17 years of experience combining technology, legal expertise and a global enforcement network.",
    },
  });
}

export default async function AboutUsPage() {
  const about = await getAbout();

  if (!about) {
    return (
      <>
        <Header />
        <main className="p-10 pt-40">
          About Us content not found. Publish the “About Us” document in Sanity
          Studio.
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <AboutHero
          headingWhite={about.heroHeadingWhite}
          headingBlue={about.heroHeadingBlue}
          description={about.heroDescription}
          buttonText={about.heroButtonText}
          buttonLink={about.heroButtonLink}
          image={about.heroBackground}
          imageAlt={about.heroBackgroundAlt}
          hotspot={about.heroHotspot}
        />
        <FadeInWhenVisible>
          <AboutPeopleSection
            heading={about.peopleHeading}
            paragraphs={about.peopleDescription}
            image={about.peopleImage}
            imageAlt={about.peopleImageAlt}
          />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <JourneySection
            heading={about.journeyHeading}
            items={about.journey}
          />
        </FadeInWhenVisible>

        {/* Light grey panel behind the clients grid and the testimonials */}
        <div className="bg-[#F5F7FB]">
          <FadeInWhenVisible>
            <TrustedClientsSection
              heading={about.clientsHeading}
              subtitle={about.clientsSubtitle}
              clients={about.clients}
            />
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <TestimonialsSection
              layout="stacked"
              heading={about.testimonialsHeading}
              subtitle={about.testimonialsSubtitle}
              items={about.testimonials}
            />
          </FadeInWhenVisible>
        </div>
      </main>
    </>
  );
}
