import { manrope } from "@/app/fonts";
import {
  LinkedInFollowButton,
  LinkedInPostCard,
  type LinkedInPost,
} from "@/components/linkedin";

type Props = {
  heading?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  // Already the 3 newest posts of the "Digital Footprint Page" document (see
  // footprintHomeQuery in queries.ts); /digital-footprint shows the full list.
  posts?: LinkedInPost[] | null;
};

export default function DigitalFootprintSection({
  heading,
  subtitle,
  buttonText,
  buttonLink,
  posts,
}: Props) {
  const cards = (posts ?? []).filter((p) => p?.text?.trim());
  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="digital-footprint-heading"
      className="bg-[#F6F7FB] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        {/* Header: title + subtitle, LinkedIn button on the right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="digital-footprint-heading"
              className={`${manrope.className} text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3.3rem]`}
            >
              {heading || "Our Digital Footprint"}
            </h2>
            <p className="mt-3 text-[15px] text-[#667085]">
              {subtitle || "Follow Copyright Integrity and Make an impression"}
            </p>
          </div>

          <LinkedInFollowButton
            href={buttonLink}
            label={buttonText}
            variant="home"
          />
        </div>

        {/* Post cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {cards.map((post) => (
            <LinkedInPostCard key={post._key} post={post} variant="home" />
          ))}
        </div>
      </div>
    </section>
  );
}
