import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import HeaderClient from "@/components/HeaderClient";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceKeyFeatures from "@/components/service/ServiceKeyFeatures";
import ServiceWhySection from "@/components/service/ServiceWhySection";
import ServiceProtectGrid from "@/components/service/ServiceProtectGrid";
import ServiceBenefits from "@/components/service/ServiceBenefits";
import ServiceCoverGrid from "@/components/service/ServiceCoverGrid";
import ServiceCtaBanner from "@/components/service/ServiceCtaBanner";
import WhyChooseSection from "@/components/service/WhyChooseSection";
import FaqAccordion from "@/components/service/FaqAccordion";
import { SERVICES_FALLBACK } from "@/lib/services";
import {
  getService,
  getServiceSlugs,
  getServicesPage,
} from "@/sanity/lib/getServices";
import { buildMetadata } from "@/sanity/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Prerender every service at build time. With Cache Components this must return at
// least one param, so a placeholder is used while the CMS has no services yet
// (the page answers it with a 404). Services published later render on first visit.
export async function generateStaticParams() {
  const slugs = (await getServiceSlugs()).filter((s) => s?.slug);
  return slugs.length > 0 ? slugs : [{ slug: "no-services-yet" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service)
    return {
      title: "Service not found | Copyright Integrity International",
      robots: { index: false },
    };

  return buildMetadata({
    seo: service.seo,
    path: `/services/${slug}`,
    fallback: {
      title: `${service.title} | Copyright Integrity International`,
      description: service.heroSubtitle || service.shortDescription,
      image: service.image,
    },
  });
}

// NOT async: `params` is URL data, so it is passed down as a promise and only
// awaited inside <Suspense>. The header is wrapped too, so nothing that reads
// data sits outside a boundary; its fallback is the real navigation with the
// built-in service titles, so nothing jumps when the Sanity data streams in.
export default function ServiceDetailPage({ params }: Props) {
  return (
    <>
      <Suspense fallback={<HeaderClient services={SERVICES_FALLBACK} />}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<ServicePageSkeleton />}>
          <ServiceContent params={params} />
        </Suspense>
      </main>
    </>
  );
}

// Roughly the size of the real hero, so nothing jumps when the content streams in
function ServicePageSkeleton() {
  return (
    <div aria-hidden className="animate-pulse motion-reduce:animate-none">
      <section className="bg-[#031236]">
        <div className="mx-auto max-w-[1338px] px-6 pb-14 pt-36 lg:px-12 lg:pb-16 lg:pt-[10rem]">
          <div className="h-12 w-3/4 max-w-[640px] rounded bg-white/10 lg:h-16" />
          <div className="mt-4 h-12 w-1/3 max-w-[300px] rounded bg-white/10 lg:h-16" />
          <div className="mt-8 h-4 w-full max-w-[520px] rounded bg-white/10" />
          <div className="mt-3 h-4 w-2/3 max-w-[360px] rounded bg-white/10" />
          <div className="mt-12 h-24 border-t border-white/15" />
        </div>
      </section>
      <div className="h-[480px] bg-white" />
    </div>
  );
}

async function ServiceContent({ params }: Props) {
  const { slug } = await params;
  const [service, shared] = await Promise.all([
    getService(slug),
    getServicesPage(), // the "Why Choose" block is shared by every service
  ]);
  if (!service) notFound();

  const lowerTitle = String(service.title).toLowerCase();
  const faqs = (service.faqs ?? []).filter(
    (f: { question?: string; answer?: string }) =>
      f?.question?.trim() && f?.answer?.trim(),
  );

  // Structured data so search engines can show the questions as rich results
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f: { question: string; answer: string }) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <ServiceHero
        title={service.title}
        titleWhite={service.heroTitleWhite}
        titleBlue={service.heroTitleBlue}
        subtitle={service.heroSubtitle || service.shortDescription}
        image={service.heroImage || service.image}
        imageAlt={service.heroImage ? service.heroImageAlt : service.imageAlt}
        hotspot={service.heroImage ? service.heroHotspot : service.hotspot}
        features={service.features}
      />

      <ServiceKeyFeatures
        heading={service.keyFeaturesHeading}
        intro={service.keyFeaturesIntro}
        items={service.keyFeatures}
      />

      <ServiceWhySection
        heading={service.whyHeading || `Why do you need ${lowerTitle}?`}
        text={service.whyText}
        points={service.whyPoints}
        image={service.whyImage}
        imageAlt={service.whyImageAlt}
      />

      <ServiceProtectGrid
        heading={service.protectHeading}
        items={service.protectItems}
      />

      <ServiceBenefits
        heading={
          service.benefitsHeading ||
          `How does ${lowerTitle} benefit your brand?`
        }
        items={service.benefits}
      />

      <ServiceCoverGrid
        heading={service.coverHeading}
        intro={service.coverIntro}
        items={service.coverItems}
      />

      <ServiceCtaBanner
        eyebrow={service.ctaEyebrow}
        heading={service.ctaHeading}
        text={service.ctaText}
        buttonLabel={service.ctaButtonLabel}
        link={service.ctaLink}
      />

      <WhyChooseSection
        heading={service.whyChooseHeading || shared?.whyChooseHeading}
        items={
          service.whyChooseItems?.length
            ? service.whyChooseItems
            : shared?.whyChooseItems
        }
      />

      <FaqAccordion heading={service.faqHeading} items={faqs} />

      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
