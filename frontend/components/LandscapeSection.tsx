import Image from "next/image";

type Card = {
  _key: string;
  title: string;
  description: string;
  image: string;
  hotspot?: { x: number; y: number } | null;
};

type Props = {
  heading?: string | null;
  description?: string | null;
  cards?: Card[] | null;
};

export default function LandscapeSection({
  heading,
  description,
  cards,
}: Props) {
  const items = (cards ?? []).filter((c) => c?.image && c?.title);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="landscape-heading"
      className="bg-white pb-20 pt-6 lg:pb-28 lg:pt-10"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Heading row */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {heading && (
            <h2
              id="landscape-heading"
              className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-5xl"
            >
              {heading}
            </h2>
          )}
          {description && (
            <p className="max-w-md text-base leading-relaxed text-brand-blue lg:mt-3 lg:text-lg">
              {description}
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {items.map((card) => (
            <article
              key={card._key}
              className="group relative isolate aspect-[3/4] overflow-hidden rounded-2xl bg-[#002060]"
            >
              <Image
                src={card.image}
                alt=""
                fill
                loading="eager"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                style={
                  card.hotspot
                    ? {
                        objectPosition: `${card.hotspot.x * 100}% ${card.hotspot.y * 100}%`,
                      }
                    : undefined
                }
                className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />

              {/* navy tint over the whole image */}
              <div className="absolute inset-0 -z-10 bg-[#002060]/50" />
              {/* dark gradient at the bottom for text legibility */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#001340] via-[#001340]/70 via-40% to-transparent" />
              {/* thin cyan highlight on the top edge */}
              <div className="absolute inset-x-0 top-0 h-px bg-brand-cyan/60" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
                <h3 className="text-xl font-semibold leading-snug lg:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 lg:text-base">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
