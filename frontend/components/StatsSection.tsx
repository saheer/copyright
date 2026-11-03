"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Stat = {
  _key: string;
  value?: string | null;
  label?: string | null;
};

type Props = {
  items?: Stat[] | null;
  note?: string | null;
};

/* ---------- Counter settings (edit these) ---------- */
const DURATION_MS = 2000; // every counter finishes together
// Custom starting values, keyed by the exact text typed in Sanity.
// Numbers are in the same unit as shown (50M+ -> 28 means "28M").
const START_OVERRIDES: Record<string, number> = {
  "200,000+": 110000,
  "1000+": 550,
  "50M+": 28,
};
// Any statistic NOT listed above starts at this share of its final number.
const DEFAULT_START_RATIO = 0.55;
/* --------------------------------------------------- */

// Fast start, soft landing – matches the reference video
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Parsed = {
  prefix: string;
  suffix: string;
  start: number;
  end: number;
  decimals: number;
  grouped: boolean;
};

// "200,000+" -> {prefix: '', end: 200000, suffix: '+', grouped: true}
function parseStat(text: string): Parsed | null {
  const m = text.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const end = parseFloat(num.replace(/,/g, ""));
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  const start = START_OVERRIDES[text] ?? end * DEFAULT_START_RATIO;
  return { prefix, suffix, start, end, decimals, grouped: num.includes(",") };
}

function format(n: number, p: Parsed) {
  return (
    p.prefix +
    n.toLocaleString("en-US", {
      minimumFractionDigits: p.decimals,
      maximumFractionDigits: p.decimals,
      useGrouping: p.grouped,
    }) +
    p.suffix
  );
}

export default function StatsSection({ items, note }: Props) {
  const stats = (items ?? []).filter((s) => s?.value && s?.label);
  const sectionRef = useRef<HTMLElement>(null);
  // 1 = final numbers (server render, no-JS, reduced motion)
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let raf = 0;
    let started = false;

    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / DURATION_MS, 1);
        setProgress(easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started) return;
        if (entry.isIntersecting) {
          started = true;
          observer.disconnect();
          run();
        } else {
          setProgress(0); // below the fold: park at the starting values
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Key statistics"
      className="bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="overflow-hidden rounded-3xl border border-gray-200">
          <div
            style={{ "--cols": stats.length } as CSSProperties}
            className="grid grid-cols-1 divide-y divide-gray-200 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] md:divide-x md:divide-y-0"
          >
            {stats.map((stat) => {
              const text = stat.value as string;
              const parsed = parseStat(text);
              const shown = parsed
                ? format(
                    parsed.start + (parsed.end - parsed.start) * progress,
                    parsed,
                  )
                : text;

              return (
                <div
                  key={stat._key}
                  className="group flex flex-col px-9 pb-9 pt-10 text-[#002060] transition-colors duration-300 hover:bg-[#F9F9FB]"
                >
                  <p
                    aria-label={text}
                    className="text-5xl font-bold leading-none tracking-tight tabular-nums lg:text-[3.75rem]"
                  >
                    <span aria-hidden>{shown}</span>
                  </p>
                  <p className="mt-6 text-base font-semibold lg:text-lg">
                    {stat.label}
                  </p>
                  <span
                    aria-hidden
                    className="mt-12 h-0.5 w-8 rounded-full bg-brand-cyan transition-[width] duration-300 ease-out group-hover:w-16"
                  />
                </div>
              );
            })}
          </div>

          {note && (
            <p className="border-t border-gray-200 bg-[#F9F9FB] px-9 py-5 text-sm text-slate-400">
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
