import Link from "next/link";
import { loadSvg } from "@/sanity/lib/inlineSvg";

type Service = {
  _key: string;
  title: string;
  link?: string | null;
  icon?: string | null;
  iconType?: string | null;
};

type Props = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  items?: Service[] | null;
  buttonLabel?: string | null;
  serviceButtonLink?: string | null;
};

// Default icons (frontend/public/icons/services), used when none is uploaded in Sanity
const FALLBACK_ICONS = [
  "icons/services/live-stream.svg",
  "icons/services/video-mobile.svg",
  "icons/services/brand-protection.svg",
  "icons/services/research-advisory.svg",
];

const iconBox =
  "block h-14 w-14 shrink-0 transition-[filter] duration-300 group-hover:drop-shadow-[0_0_14px_rgba(0,174,239,0.65)] lg:h-26 lg:w-26";

async function ServiceIcon({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const isRaster =
    !!service.icon && !!service.iconType && !service.iconType.includes("svg");
  if (isRaster) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={service.icon!}
        alt=""
        width={64}
        height={64}
        className={iconBox}
      />
    );
  }
  const svg = await loadSvg(service.icon, FALLBACK_ICONS[index]);
  if (!svg) return <span aria-hidden className={iconBox} />;
  return (
    <span
      aria-hidden
      className={`${iconBox} [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const cardClass =
  "group flex min-h-[200px] flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center transition duration-300 lg:min-h-[230px]";
const cardHover =
  "hover:-translate-y-1 hover:border-brand-cyan/60 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-12px_rgba(0,174,239,0.55)] motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan";

export default async function ServicesSection({
  eyebrow,
  heading,
  description,
  items,
  buttonLabel,
  serviceButtonLink,
}: Props) {
  const services = (items ?? []).filter((s) => s?.title);
  if (services.length === 0) return null;

  // Fields saved in Sanity win; the defaults keep the button visible when they are empty
  // (a strip of any typed trailing arrow keeps it to exactly one "→")
  const buttonText = (buttonLabel || "Explore our services")
    .replace(/\s*[→➔➜]+\s*$/u, "")
    .trim();

  return (
    <section
      aria-labelledby="services-heading"
      className="bg-[#F5F7FB] pb-16 lg:pb-24"
    >
      <div className="mx-auto max-w-[1280px] px-8 lg:px-15">
        <div className="relative overflow-hidden rounded-3xl border border-brand-cyan/25 bg-[#03112D] bg-[radial-gradient(ellipse_at_top_right,rgba(0,174,239,0.16),transparent_55%)] px-6 py-14 shadow-[0_0_70px_-25px_rgba(0,174,239,0.45)] lg:px-12 lg:py-20">
          {/* glowing top edge */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/70 to-transparent" />

          {/* Heading row */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div>
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-cyan">
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h2
                  id="services-heading"
                  className="mt-4 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white lg:text-5xl"
                >
                  {heading}
                </h2>
              )}
            </div>
            {description && (
              <p className="max-w-sm text-sm leading-relaxed text-[#818896] lg:pb-2 lg:text-base">
                {description}
              </p>
            )}
          </div>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {services.map((service, i) => {
              const inner = (
                <>
                  <ServiceIcon service={service} index={i} />
                  <h3 className="max-w-[12rem] text-balance text-base font-semibold leading-snug text-white lg:text-lg">
                    {service.title}
                  </h3>
                </>
              );

              if (!service.link) {
                return (
                  <div key={service._key} className={cardClass}>
                    {inner}
                  </div>
                );
              }

              // Page on this site -> client-side routing; anything else opens in a new tab
              const external = /^https?:\/\//i.test(service.link);
              return external ? (
                <a
                  key={service._key}
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} ${cardHover}`}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={service._key}
                  href={service.link}
                  className={`${cardClass} ${cardHover}`}
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* CTA button: buttonLabel / serviceButtonLink from Sanity, with defaults */}
          {buttonText && (
            <Link
              href={serviceButtonLink || "/services"}
              className="group/cta relative isolate mt-10 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition-[border-color] duration-300 ease-out before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-brand-blue before:transition-transform before:duration-300 before:ease-out hover:border-transparent hover:before:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan motion-reduce:before:transition-none lg:mt-12"
            >
              {buttonText}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover/cta:translate-x-1 motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
