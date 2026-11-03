import { manrope } from "@/app/fonts";

type Milestone = {
  _key: string;
  year?: string | null;
  title?: string | null;
  description?: string | null;
};

type Props = {
  heading?: string | null;
  items?: Milestone[] | null;
};

export default function JourneySection({ heading, items }: Props) {
  const steps = (items ?? []).filter((m) => m?.title?.trim());
  if (steps.length === 0) return null;

  return (
    <section
      id="our-journey"
      aria-labelledby="journey-heading"
      className="scroll-mt-24 bg-white pb-16 lg:pb-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <h2
          id="journey-heading"
          className={`${manrope.className} text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3rem]`}
        >
          {heading || "Our Journey"}
        </h2>

        {/* gap-px over a lighter background draws the hairline dividers at any column count */}
        <ol className="relative mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[#0B2150] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-[#38A9EA]/60 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((m) => (
            <li
              key={m._key}
              className="group flex flex-col bg-[#02143B] p-6 transition-colors duration-300 hover:bg-[#04194A] lg:p-8"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A2A6B] transition-transform duration-300 group-hover:scale-110"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38A9EA]" />
                </span>
                {m.year && (
                  <span className="text-[11px] font-semibold tracking-[0.25em] text-[#38A9EA]">
                    {m.year}
                  </span>
                )}
              </div>

              <h3
                className={`${manrope.className} mt-8 text-[1.4rem] font-bold leading-tight text-white`}
              >
                {m.title}
              </h3>
              {m.description && (
                <p className="mt-3 text-[13px] leading-[1.65] text-[#8F9AB3]">
                  {m.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
