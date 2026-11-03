import type { CSSProperties } from "react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { readFile } from "node:fs/promises";
import path from "node:path";

type Step = {
  _key: string;
  title: string;
  subtitle?: string | null;
  highlight?: string | null;
  icon?: string | null;
  iconType?: string | null;
};

type Props = {
  heading?: string | null;
  description?: string | null;
  steps?: Step[] | null;
  ctaText?: string | null;
  ctaLink?: string | null;
};

// Default icons (frontend/public/icons) used when nothing usable is uploaded in Sanity
const FALLBACK_FILES = [
  "view-icon-1.svg",
  "zoom-icon-1.svg",
  "action-icon-1.svg",
];

// Keep only the <svg>…</svg> part and drop anything executable
function cleanSvg(raw: string): string | null {
  const m = raw.match(/<svg[\s\S]*<\/svg>/i);
  if (!m) return null;
  return m[0]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(
      /(xlink:href|href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi,
      "",
    );
}

// Fetched on the server (so browser/CDN quirks can't break it), cached, and
// refreshed together with the "home" tag. Falls back to the bundled icon.
async function loadSvg(
  url: string | null | undefined,
  fallbackFile: string | undefined,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("home");

  if (url) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const svg = cleanSvg(await res.text());
        if (svg) return svg;
      }
    } catch {
      /* fall through to the bundled icon */
    }
  }
  if (fallbackFile) {
    try {
      const raw = await readFile(
        path.join(process.cwd(), "public", "icons", fallbackFile),
        "utf8",
      );
      return cleanSvg(raw);
    } catch {
      /* no bundled icon either */
    }
  }
  return null;
}

const iconBox = "block h-20 w-20 shrink-0 lg:h-24 lg:w-24";

async function StepIcon({ step, index }: { step: Step; index: number }) {
  const isRaster =
    !!step.icon && !!step.iconType && !step.iconType.includes("svg");

  // PNG / JPG uploads: a normal <img> is all that is needed
  if (isRaster) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={step.icon!} alt="" width={96} height={96} className={iconBox} />
    );
  }

  const svg = await loadSvg(step.icon, FALLBACK_FILES[index]);
  if (!svg) return null;
  return (
    <span
      aria-hidden
      className={`${iconBox} [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default async function ApproachSection({
  heading,
  description,
  steps,
  ctaText,
  ctaLink,
}: Props) {
  const items = (steps ?? []).filter((s) => s?.title);
  if (items.length === 0) return null;

  // Strip a trailing arrow typed in the CMS so only one "→" shows
  const cta = ctaText?.replace(/\s*[→➔➜]+\s*$/u, "").trim();

  return (
    <section
      aria-labelledby="approach-heading"
      className="bg-[#F5F7FB] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Heading row */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {heading && (
            <h2
              id="approach-heading"
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-5xl"
            >
              {heading}
            </h2>
          )}
          {description && (
            <p className="max-w-sm text-base leading-relaxed text-brand-blue">
              {description}
            </p>
          )}
        </div>

        {/* Dark card with one column per step */}
        <div
          style={{ "--cols": items.length } as CSSProperties}
          className="mt-10 grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl bg-[#03112D] md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] md:divide-x md:divide-y-0 lg:mt-14"
        >
          {items.map((step, i) => (
            <div
              key={step._key}
              className="flex items-center gap-6 px-8 py-10 lg:gap-5 lg:px-10 lg:py-12"
            >
              <StepIcon step={step} index={i} />
              <span aria-hidden className="h-16 w-px shrink-0 bg-white/15" />
              <div>
                <h3 className="text-2xl font-semibold leading-tight text-white lg:text-[1.75rem]">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="mt-2 text-base leading-snug text-[#818896] lg:text-lg">
                    {step.subtitle}
                  </p>
                )}
                {step.highlight && (
                  <p className="mt-4 max-w-[16rem] text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-[#4EABE9]">
                    {step.highlight}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {cta && (
          <Link
            href={ctaLink || "/about-us"}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-[#002060] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          >
            {cta}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
