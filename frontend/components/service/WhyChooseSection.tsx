import { manrope } from "@/app/fonts";
import ServiceIcon from "@/components/service/ServiceIcon";

type Item = {
  _key: string;
  title?: string | null;
  description?: string | null;
  icon?: unknown;
};

// Shown until the strengths are entered in Sanity, so the section never disappears
const DEFAULT_ITEMS: Item[] = [
  "Human x Artificial Intelligence",
  "Personalised Digital Protection",
  "24/7 Vigilance & Protection",
  "Legal x Technology Expertise",
  "Cost-effective Protection",
  "Comprehensive Reporting",
].map((title) => ({ _key: title, title, description: null, icon: null }));

export default function WhyChooseSection({
  heading,
  items,
}: {
  heading?: string | null;
  items?: Item[] | null;
}) {
  const fromCms = (items ?? []).filter((i) => i?.title?.trim());
  const cards = fromCms.length > 0 ? fromCms : DEFAULT_ITEMS;

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="bg-[linear-gradient(135deg,#02123A_0%,#0A1A3A_55%,#041433_100%)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <h2
          id="why-choose-heading"
          className={`${manrope.className} max-w-[600px] text-3xl font-bold leading-[1.1] tracking-tight text-white lg:text-[2.75rem]`}
        >
          {heading || "Why Choose Copyright Integrity"}
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li
              key={c._key}
              className="flex min-h-[188px] flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-9 text-center transition-colors duration-300 hover:border-brand-cyan/40 hover:bg-white/[0.06]"
            >
              <ServiceIcon src={c.icon} className="h-14 w-14" />
              <div>
                <h3 className="text-[15px] font-semibold text-white">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-[1.6] text-[#8FA0C4]">
                    {c.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
