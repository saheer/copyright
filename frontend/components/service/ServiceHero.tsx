import Image from "next/image";
import { manrope } from "@/app/fonts";
import { hotspotStyle, type Hotspot } from "@/lib/services";

type Props = {
  title: string;
  titleWhite?: string | null;
  titleBlue?: string | null;
  subtitle?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  hotspot?: Hotspot;
  features?: string[] | null;
};

export default function ServiceHero({
  title,
  titleWhite,
  titleBlue,
  subtitle,
  image,
  imageAlt,
  hotspot,
  features,
}: Props) {
  // Without a blue part the whole title is white
  const white = titleBlue ? titleWhite || "" : titleWhite || title;
  const tags = (features ?? []).filter((f) => f?.trim());

  return (
    <section className="relative isolate overflow-hidden bg-[#031236]">
      {image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          style={hotspotStyle(hotspot)}
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#041640]/95 via-[#0A2164]/85 to-[#0A2164]/70" />

      <div className="relative z-10 mx-auto max-w-[1338px] px-6 pb-14 pt-36 lg:px-12 lg:pb-16 lg:pt-[10rem]">
        <h1
          className={`${manrope.className} max-w-[900px] animate-fade-up text-4xl font-bold leading-[1.05] tracking-[-0.01em] text-white motion-reduce:animate-none sm:text-5xl lg:text-[3.75rem]`}
        >
          {white && <span className="block">{white}</span>}
          {titleBlue && (
            <span className="block text-brand-cyan">{titleBlue}</span>
          )}
        </h1>

        {subtitle && (
          <p
            style={{ animationDelay: "150ms" }}
            className="mt-6 max-w-[520px] animate-fade-up text-[15px] leading-[1.7] text-white/75 motion-reduce:animate-none"
          >
            {subtitle}
          </p>
        )}

        {tags.length > 0 && (
          <ul className="mt-12 grid gap-x-8 gap-y-3 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {tags.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 text-[13px] text-white/80"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan"
                />
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
