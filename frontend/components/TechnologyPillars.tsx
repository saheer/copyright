import Image from "next/image";
import { manrope } from "@/app/fonts";

type Pillar = {
  _key: string;
  title: string;
  description?: string | null;
  image: string;
  imageAlt?: string | null;
  hotspot?: { x: number; y: number } | null;
};

type Props = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  pillars?: Pillar[] | null;
};

export default function TechnologyPillars({
  eyebrow,
  heading,
  description,
  pillars,
}: Props) {
  const items = (pillars ?? []).filter((p) => p?.title && p?.image);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="pillars-heading"
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-cyan">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                id="pillars-heading"
                className={`${manrope.className} mt-4 whitespace-pre-line text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3.25rem]`}
              >
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="max-w-sm text-sm leading-relaxed text-[#1E3A72] lg:pb-2">
              {description}
            </p>
          )}
        </div>

        {/* Pillars: rows alternate image-left / image-right */}
        <ul className="mt-12 space-y-6 lg:mt-16 lg:space-y-8">
          {items.map((pillar, i) => {
            const imageRight = i % 2 === 1;
            return (
              <li
                key={pillar._key}
                className={`group grid overflow-hidden rounded-2xl border border-slate-200 bg-white ${
                  imageRight
                    ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
                    : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                }`}
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden bg-[#0a1a3a] lg:aspect-auto lg:min-h-[280px] ${
                    imageRight ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt || ""}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    style={{
                      objectPosition: pillar.hotspot
                        ? `${pillar.hotspot.x * 100}% ${pillar.hotspot.y * 100}%`
                        : undefined,
                    }}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>

                <div className="flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-12">
                  <h3
                    className={`${manrope.className} text-3xl font-bold leading-tight tracking-tight text-[#002060] lg:text-[2.25rem]`}
                  >
                    {pillar.title}
                  </h3>
                  {pillar.description && (
                    <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.7] text-[#1E3A72]">
                      {pillar.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
