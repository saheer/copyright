import Image from "next/image";
import Link from "next/link";
import { manrope } from "@/app/fonts";

type Props = {
  headingWhite?: string | null;
  headingBlue?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  hotspot?: { x: number; y: number } | null;
};

export default function AboutHero({
  headingWhite,
  headingBlue,
  description,
  buttonText,
  buttonLink,
  image,
  imageAlt,
  hotspot,
}: Props) {
  // Strip any trailing arrow typed in the CMS so only one "→" ever shows
  const label = buttonText?.replace(/\s*[→➔➜]+\s*$/u, "").trim();
  const objectPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

  return (
    <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-[#0C225E] lg:min-h-[700px]">
      {image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          style={{ objectPosition }}
          className="object-cover"
        />
      )}
      {/* deep blue tint, as in the design */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A2164]/95 via-[#0A2164]/85 to-[#0A2164]/60" />

      <div className="relative z-10 mx-auto w-full max-w-[1338px] px-6 pb-24 pt-40 lg:px-12">
        <h1
          className={`${manrope.className} animate-fade-up text-5xl font-bold leading-[1.1] tracking-[-0.01em] text-white motion-reduce:animate-none sm:text-6xl lg:text-[4.25rem]`}
        >
          {/* the white part wraps like the design ("Intelligence That / Protects") */}
          <span className="block max-w-[10.5em]">{headingWhite}</span>
          <span className="block text-brand-cyan">{headingBlue}</span>
        </h1>

        {description && (
          <p
            style={{ animationDelay: "150ms" }}
            className="mt-8 max-w-[640px] animate-fade-up text-base leading-[1.75] text-white/85 motion-reduce:animate-none"
          >
            {description}
          </p>
        )}

        {label && (
          <Link
            href={buttonLink || "#our-journey"}
            style={{ animationDelay: "300ms" }}
            className="relative isolate mt-10 inline-flex animate-fade-up items-center overflow-hidden rounded-full border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition-[border-color] duration-300 ease-out before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-brand-blue before:transition-transform before:duration-300 before:ease-out hover:border-transparent hover:before:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 motion-reduce:animate-none"
          >
            {label} →
          </Link>
        )}
      </div>

      {/* scroll cue */}
      <a
        href="#our-people"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 hidden h-7 w-4 -translate-x-1/2 justify-center rounded-full border border-white/50 pt-1.5 sm:flex"
      >
        <span className="h-1 w-1 rounded-full bg-white motion-safe:animate-pulse" />
      </a>
    </section>
  );
}
