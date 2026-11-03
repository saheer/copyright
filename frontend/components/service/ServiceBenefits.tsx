import { manrope } from "@/app/fonts";
import ServiceIcon from "@/components/service/ServiceIcon";

type Item = {
  _key: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export default function ServiceBenefits({
  heading,
  items,
}: {
  heading: string;
  items?: Item[] | null;
}) {
  const cards = (items ?? []).filter((i) => i?.title?.trim());
  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="service-benefits-heading"
      className="bg-[linear-gradient(180deg,#061A4D_0%,#030F33_100%)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <h2
          id="service-benefits-heading"
          className={`${manrope.className} max-w-[640px] text-3xl font-bold leading-[1.15] tracking-tight text-white lg:text-[2.25rem]`}
        >
          {heading}
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li
              key={c._key}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-7 py-9 text-center transition-colors duration-300 hover:border-brand-cyan/40 hover:bg-white/[0.07]"
            >
              <ServiceIcon src={c.icon} className="h-12 w-12" />
              <h3
                className={`${manrope.className} mt-5 text-xl font-bold leading-tight text-white`}
              >
                {c.title}
              </h3>
              {c.description && (
                <p className="mt-3 text-[13px] leading-[1.65] text-[#8FA0C4]">
                  {c.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
