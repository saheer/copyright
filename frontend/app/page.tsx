import type { Metadata } from "next";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import StatsSection from "@/components/StatsSection";
import LandscapeSection from "@/components/LandscapeSection";
import ApproachSection from "@/components/ApproachSection";
import ServicesSection from "@/components/ServicesSection";
import WhySection from "@/components/WhySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DigitalFootprintSection from "@/components/DigitalFootprintSection";
import DigitalDigestSection from "@/components/DigitalDigestSection";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import { getHome, getNewsletter } from "@/sanity/lib/getHome";
import { getFootprintHome } from "@/sanity/lib/getFootprint";
import { getDigestHome } from "@/sanity/lib/getDigest";
import { getContact } from "@/sanity/lib/getContact";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("home");
  return buildMetadata({
    seo: page?.seo,
    path: "/",
    fallback: {
      title: "Copyright Integrity International",
      description: "Leading digital rights protection with agency",
    },
  });
}

export default async function HomePage() {
  // The Home Page, Digital Footprint Page and Contact Us documents are separate
  // Studio documents, so they are fetched (and cached) separately, in parallel.
  const [home, footprint, digest, newsletter, contact] = await Promise.all([
    getHome(),
    getFootprintHome(),
    getDigestHome(),
    getNewsletter(),
    getContact(),
  ]);

  if (!home) {
    return (
      <main className="p-10">
        Home content not found. Publish the “Home Page” document in Sanity
        Studio.
      </main>
    );
  }

  const {
    logos,
    stats,
    statsNote,
    landscape,
    approach,
    services,
    why,
    testimonials,
    ...hero
  } = home;

  return (
    <>
      <Header />
      <main>
        <Hero {...hero} />
        <FadeInWhenVisible>
          <LogoMarquee logos={logos} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <StatsSection items={stats} note={statsNote} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <LandscapeSection {...landscape} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <ApproachSection {...approach} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <ServicesSection {...services} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <WhySection {...why} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <TestimonialsSection {...testimonials} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <DigitalFootprintSection {...footprint} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <DigitalDigestSection posts={digest} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <NewsletterSection {...(newsletter ?? {})} />
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <ContactSection {...(contact ?? {})} />
        </FadeInWhenVisible>
      </main>
    </>
  );
}
