"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { manrope } from "@/app/fonts";

type Item = {
  _key: string;
  tabLabel?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
};

type Props = {
  heading?: string | null;
  intro?: string | null;
  items?: Item[] | null;
};

export default function ServiceKeyFeatures({ heading, intro, items }: Props) {
  const tabs = (items ?? []).filter(
    (i) => i?.tabLabel?.trim() || i?.title?.trim(),
  );
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  const index = Math.min(active, tabs.length - 1);
  const current = tabs[index];

  const select = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  // WAI-ARIA tabs: arrow keys move between tabs, Home / End jump to the first / last
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    select(next);
  };

  return (
    <section
      aria-labelledby={`${uid}-heading`}
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
          <h2
            id={`${uid}-heading`}
            className={`${manrope.className} text-3xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[2.5rem]`}
          >
            {heading || "Key Features"}
          </h2>
          {intro && (
            <p className="max-w-[420px] text-[15px] leading-[1.6] text-[#1E3A72] lg:justify-self-end lg:pb-1">
              {intro}
            </p>
          )}
        </div>

        <div
          role="tablist"
          aria-label={heading || "Key Features"}
          className="mt-10 flex border-b border-[#DDE6F2]"
        >
          {tabs.map((t, i) => (
            <button
              key={t._key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${uid}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={`${uid}-panel`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`-mb-px flex-1 border-b-2 px-3 py-4 text-center text-[13px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue ${
                i === index
                  ? "border-brand-blue text-[#0C2268]"
                  : "border-transparent text-[#7C8BA8] hover:text-[#0C2268]"
              }`}
            >
              {t.tabLabel || t.title}
            </button>
          ))}
        </div>

        {/* key={index} re-mounts the panel so it fades in on every tab change */}
        <div
          key={index}
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${index}`}
          className="mt-6 grid animate-fade-up overflow-hidden rounded-2xl bg-[#F4F6FB] motion-reduce:animate-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
        >
          <div className="flex flex-col justify-center p-8 lg:p-12">
            {current.tabLabel && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-blue">
                {current.tabLabel}
              </p>
            )}
            {current.title && (
              <h3
                className={`${manrope.className} mt-4 max-w-[420px] text-[1.7rem] font-bold leading-[1.15] text-[#0C2268] lg:text-[2rem]`}
              >
                {current.title}
              </h3>
            )}
            {current.description && (
              <p className="mt-5 max-w-[460px] text-[14.5px] leading-[1.75] text-[#2A4879]">
                {current.description}
              </p>
            )}
          </div>

          <div className="relative min-h-[260px] bg-[#0C225E]">
            {current.image && (
              <Image
                src={current.image}
                alt={current.imageAlt || ""}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
