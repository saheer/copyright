import Image from "next/image";
import Link from "next/link";
import { manrope } from "@/app/fonts";

// Shared building blocks for the Digital Digest cards: used by the Home page section
// (3 newest), and the /digital-digest page (featured slot + grid).

export type DigestPost = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  hotspot?: { x: number; y: number } | null;
};

// "2026-09-15" -> "15 September 2026" (UTC so the day never shifts with the server's zone)
export function formatDigestDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export const postHref = (slug: string) => `/digital-digest/${slug}`;

export const hotspotPosition = (hotspot?: { x: number; y: number } | null) =>
  hotspot
    ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
    : undefined;

function CategoryTag({ children }: { children: string }) {
  return (
    <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-white/90 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase leading-none tracking-[0.08em] text-[#0E1D48] shadow-sm">
      {children}
    </span>
  );
}

function ReadMore({ href, title }: { href: string; title?: string | null }) {
  // The ::after overlay makes the WHOLE card clickable, while the visible link stays
  // the only tab stop.
  return (
    <Link
      href={href}
      aria-label={title ? `Read more: ${title}` : undefined}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#244598] transition-colors after:absolute after:inset-0 after:content-[''] hover:text-[#16306E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#244598]"
    >
      Read More
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

// Regular card (thumbnail, tag, title, excerpt, Read More)
export function DigestCard({
  post,
  priority = false,
}: {
  post: DigestPost;
  priority?: boolean;
}) {
  if (!post.slug || !post.title) return null;
  const href = postHref(post.slug);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DCE3EF] bg-white transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(16,40,100,0.10)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0C225E]">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || ""}
            fill
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            style={hotspotPosition(post.hotspot)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
        {post.category && <CategoryTag>{post.category}</CategoryTag>}
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <h3
          className={`${manrope.className} text-[19px] font-semibold leading-snug text-[#081F5C]`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-[1.65] text-[#2A4879]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-6">
          <ReadMore href={href} title={post.title} />
        </div>
      </div>
    </article>
  );
}

// Large "Featured" card at the top of the /digital-digest page
export function DigestFeaturedCard({ post }: { post: DigestPost }) {
  if (!post.slug || !post.title) return null;
  const href = postHref(post.slug);

  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-[#DCE3EF] bg-white lg:grid-cols-2">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0C225E] lg:aspect-auto lg:min-h-[428px]">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || ""}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={hotspotPosition(post.hotspot)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
        {post.category && <CategoryTag>{post.category}</CategoryTag>}
      </div>

      <div className="flex flex-col justify-center p-8 lg:p-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cyan">
          Featured
        </p>
        <h2
          className={`${manrope.className} mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.01em] text-[#081F5C] lg:text-[2.6rem]`}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-6 text-[15.5px] leading-[1.7] text-[#2A4879]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8">
          <ReadMore href={href} title={post.title} />
        </div>
      </div>
    </article>
  );
}
