import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import { manrope } from "@/app/fonts";
import { getContact } from "@/sanity/lib/getContact";
import {
  DEFAULT_CONTACT_DESCRIPTION,
  DEFAULT_CONTACT_HEADING,
} from "@/lib/enquiry";
import { buildMetadata } from "@/sanity/lib/seo";
import { getPageSeo } from "@/sanity/lib/getPageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageSeo("contact");
  return buildMetadata({
    seo: page?.seo,
    path: "/contact-us",
    fallback: {
      title: "Contact Us | Copyright Integrity International",
      description:
        "Learn more about our services or report an infringement: send an enquiry to Copyright Integrity International.",
    },
  });
}

export default async function ContactUsPage() {
  // The "Contact Us" document may not be published yet: fall back to the
  // built-in defaults instead of showing an error page.
  const data = (await getContact()) ?? {};

  const objectPosition = data.heroHotspot
    ? `${data.heroHotspot.x * 100}% ${data.heroHotspot.y * 100}%`
    : undefined;

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
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              style={{ objectPosition }}
              className="object-cover"
            />
          )}
          {/* navy tint keeps the white text readable on any photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B215C]/95 via-[#0E2662]/90 to-[#0E2662]/80" />

          <div className="relative z-10 mx-auto max-w-[1338px] px-6 pb-20 pt-36 lg:px-12 lg:pb-[7.2rem] lg:pt-[7.625rem]">
            <h1
              className={`${manrope.className} text-5xl font-bold leading-[1.05] tracking-[-0.008em] text-white lg:text-[4rem]`}
            >
              {data.heading || DEFAULT_CONTACT_HEADING}
            </h1>
            <p className="mt-6 max-w-[600px] text-base leading-[1.7] text-white/75">
              {data.description || DEFAULT_CONTACT_DESCRIPTION}
            </p>
          </div>
        </section>

        {/* Contact details (left) + form (right) */}
        <FadeInWhenVisible>
          <section
            aria-label="Send an enquiry"
            className="bg-white py-16 lg:py-28"
          >
            <div className="mx-auto grid max-w-[1338px] items-start gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-14 lg:px-12">
              <div className="lg:pt-12">
                <ContactInfo
                  generalEmail={data.generalEmail}
                  reportEmail={data.reportEmail}
                />
              </div>
              <ContactForm />
            </div>
          </section>
        </FadeInWhenVisible>
      </main>
    </>
  );
}
