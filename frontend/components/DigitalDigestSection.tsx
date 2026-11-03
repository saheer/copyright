import Link from "next/link";
import { manrope } from "@/app/fonts";
import { DigestCard, type DigestPost } from "@/components/DigestCard";

type Props = {
  // Already the 3 newest posts (see digestHomeQuery in queries.ts)
  posts?: DigestPost[] | null;
};

export default function DigitalDigestSection({ posts }: Props) {
  const cards = (posts ?? []).filter((p) => p?.slug && p?.title);
  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="digital-digest-heading"
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        {/* Header: title + subtitle, "View all" button on the right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="digital-digest-heading"
              className={`${manrope.className} max-w-[560px] text-4xl font-bold leading-[1.05] tracking-[-0.01em] text-[#081F5C] lg:text-[3.3rem]`}
            >
              Your Weekly Digital Digest.
            </h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-[#2A4879]">
              For the latest insights on IP protection, digital piracy, brand
              protection as they emerge from the digital matrix.
            </p>
          </div>

          <Link
            href="/digital-digest"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#2F63B5] bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#123a85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:self-auto"
          >
            View all insights
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* 3 newest posts */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {cards.map((post) => (
            <DigestCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
