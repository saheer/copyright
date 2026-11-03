import Image from "next/image";
import { manrope } from "@/app/fonts";

type Props = {
  eyebrow?: string | null;
  headingWhite?: string | null;
  headingBlue?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  hotspot?: { x: number; y: number } | null;
};

export default function TechnologyHero({
  eyebrow,
  headingWhite,
  headingBlue,
  description,
  image,
  imageAlt,
  hotspot,
}: Props) {
  const objectPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#0a1a3a] lg:min-h-[640px]">
      {image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          style={{ objectPosition }}
          className="-z-10 object-cover"
        />
      )}
      {/* deep navy tint so the white text always stays readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a1a3a]/95 via-[#0A2164]/85 to-[#0A2164]/60" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#0a1a3a]/70 to-transparent" />

      <div className="mx-auto w-full max-w-[1338px] px-6 pb-20 pt-40 lg:px-12">
        {eyebrow && (
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-brand-cyan motion-reduce:animate-none">
            {eyebrow}
          </p>
        )}

        <h1
          style={{ animationDelay: "100ms" }}
          className={`${manrope.className} mt-8 max-w-[11em] animate-fade-up text-5xl font-bold leading-[1.08] tracking-[-0.01em] text-white motion-reduce:animate-none sm:text-6xl lg:text-[4.5rem]`}
        >
          {headingWhite}
          {headingBlue && (
            <span className="block text-brand-cyan">{headingBlue}</span>
          )}
        </h1>

        {description && (
          <p
            style={{ animationDelay: "250ms" }}
            className="mt-8 max-w-[640px] animate-fade-up text-base leading-[1.75] text-white/85 motion-reduce:animate-none"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
