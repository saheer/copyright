"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { Manrope } from "next/font/google";

// The reference design is set in Manrope. It is applied to this section only,
// so the rest of the site keeps using Inter. To use the site font instead,
// delete this constant and the `font.className` in the <section> below.
const font = Manrope({ subsets: ["latin"], display: "swap" });

type Testimonial = {
  _key: string;
  author?: string | null;
  quote?: string | null;
  position?: string | null;
  company?: string | null;
};

type Props = {
  heading?: string | null;
  subtitle?: string | null;
  items?: Testimonial[] | null;
  // "split": heading left, card right (home page). "stacked": heading above a full-width card.
  layout?: "split" | "stacked";
};

// Faint horizontal rules across the card (every 60px), as in the reference
const CARD_LINES: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0, transparent 59px, rgba(255,255,255,0.035) 59px, rgba(255,255,255,0.035) 60px)",
};

const pad = (n: number) => String(n).padStart(2, "0");

// Editors may type their own quotation marks; strip them so only one pair shows
const stripQuotes = (s: string) => s.replace(/^[\s"“”„«»]+|[\s"“”„«»]+$/gu, "");

const SWIPE_MIN_PX = 50;

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        direction === "prev" ? "Previous testimonial" : "Next testimonial"
      }
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D3DAE8] text-[#3F5678] transition-[background-color,border-color,color,transform] duration-300 hover:border-[#002060] hover:bg-[#002060] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#229FCB] active:scale-95"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 ${direction === "prev" ? "rotate-180" : ""}`}
      >
        <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
      </svg>
    </button>
  );
}

export default function TestimonialsSection({
  heading,
  subtitle,
  items,
  layout = "split",
}: Props) {
  const slides = (items ?? []).filter((t) => t?.quote?.trim());
  const count = slides.length;

  // index = visible slide, prev = slide that is fading out, dir = 1 forward / -1 back
  const [view, setView] = useState({
    index: 0,
    prev: -1,
    dir: 1 as 1 | -1,
    moved: false, // no entrance animation on first paint
  });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  if (count === 0) return null;

  // Guards against the CMS returning fewer items than before
  const active = view.index < count ? view.index : 0;

  const go = (step: 1 | -1) => {
    if (count < 2) return;
    setView((v) => {
      const current = v.index < count ? v.index : 0;
      return {
        index: (current + step + count) % count,
        prev: current,
        dir: step,
        moved: true,
      };
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // horizontal swipes only, so vertical page scrolling is never hijacked
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className={`${font.className} ${
        layout === "stacked" ? "pb-16 pt-6 lg:pb-24" : "bg-white py-16 lg:py-24"
      }`}
    >
      <div className="mx-auto max-w-[1350px] px-6 lg:px-12">
        <div
          className={`grid items-center gap-10 ${
            layout === "stacked"
              ? ""
              : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
          }`}
        >
          {/* Left: heading + subtitle */}
          <div>
            <h2
              id="testimonials-heading"
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3.5rem]"
            >
              {heading || "Client Speak"}
            </h2>
            <p className="mt-4 text-base text-[#2A4064]">
              {subtitle || "Testimonials from our clients."}
            </p>
          </div>

          {/* Right: dark card + controls */}
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            style={{ "--tm-dir": view.dir } as CSSProperties}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              style={CARD_LINES}
              className="relative overflow-hidden rounded-[20px] bg-[#01102F] shadow-[0_30px_100px_-20px_rgba(1,16,47,0.3)]"
            >
              <div className="px-7 pb-9 pt-10 sm:px-10 lg:px-12 lg:pb-12 lg:pt-[3.75rem]">
                {/* Quote mark – stays put while the text changes */}
                <svg
                  aria-hidden
                  viewBox="4 6 16 12"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  className="h-7 w-9 rotate-180 text-[#0B2E54]"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>

                {/* All slides share one grid cell, so the card never changes height */}
                <div aria-live="polite" className="mt-12 grid lg:mt-[4.5rem]">
                  {slides.map((t, i) => {
                    const isActive = i === active;
                    const state = isActive
                      ? "active"
                      : i === view.prev
                        ? "exit"
                        : "idle";

                    return (
                      <figure
                        key={t._key}
                        data-state={state}
                        data-moved={view.moved}
                        aria-hidden={!isActive}
                        inert={!isActive}
                        className="testimonial-slide col-start-1 row-start-1 flex flex-col"
                      >
                        <blockquote className="text-lg 22 font-semibold italic leading-[1.65] text-[#D6E2F2] lg:text-[1.5rem] max-w-[840px]">
                          “{stripQuotes(t.quote as string)}”
                        </blockquote>

                        <div className="mt-auto pt-8">
                          <figcaption className="border-t border-[#0A2247] pt-9">
                            {t.author && (
                              <p className="mb-1.5 text-[15px] font-semibold text-white">
                                {t.author}
                              </p>
                            )}
                            {t.company && (
                              <p className="mt-1.5 text-[13px] font-bold uppercase tracking-[0.2em] text-[#229FCB]">
                                {t.company}
                              </p>
                            )}
                          </figcaption>
                        </div>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Controls: counter · progress line · arrows */}
            {count > 1 && (
              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center">
                <p
                  aria-label={`Testimonial ${active + 1} of ${count}`}
                  className="text-xs font-semibold tabular-nums tracking-[0.15em]"
                >
                  <span aria-hidden className="text-[#229FCB]">
                    {pad(active + 1)}
                  </span>
                  <span aria-hidden className="mx-2 text-slate-300">
                    /
                  </span>
                  <span aria-hidden className="text-slate-400">
                    {pad(count)}
                  </span>
                </p>

                {/* Re-draws from the left every time the slide changes */}
                <span
                  aria-hidden
                  className="block h-0.5 w-6 overflow-hidden rounded-full"
                >
                  <span
                    key={active}
                    className={`block h-full w-full origin-left rounded-full bg-[#229FCB] ${
                      view.moved ? "testimonial-progress" : ""
                    }`}
                  />
                </span>

                <div className="flex items-center gap-2 justify-self-end">
                  <ArrowButton direction="prev" onClick={() => go(-1)} />
                  <ArrowButton direction="next" onClick={() => go(1)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
