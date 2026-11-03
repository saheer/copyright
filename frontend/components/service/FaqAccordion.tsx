"use client";

import { useId, useState } from "react";
import { manrope } from "@/app/fonts";

type Faq = { _key: string; question: string; answer: string };

export default function FaqAccordion({
  heading,
  items,
}: {
  heading?: string | null;
  items: Faq[];
}) {
  // One question open at a time; the first one starts open, as in the design
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const uid = useId();

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby={`${uid}-heading`}
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          <h2
            id={`${uid}-heading`}
            className={`${manrope.className} text-3xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[2.5rem]`}
          >
            {heading || "Frequently Asked Questions"}
          </h2>

          <div className="mt-10">
            {items.map((f, i) => {
              const open = openIndex === i;
              const buttonId = `${uid}-q-${i}`;
              const panelId = `${uid}-a-${i}`;
              return (
                <div
                  key={f._key}
                  className="border-t border-[#E3E9F3] last:border-b"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue"
                    >
                      <span className="text-[14.5px] font-bold leading-snug text-[#0C2268]">
                        {f.question}
                      </span>
                      <span
                        aria-hidden
                        className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[#0C2268] transition-colors duration-300 ${
                          open
                            ? "border-brand-blue bg-brand-blue/10"
                            : "border-[#D5DFEE]"
                        }`}
                      >
                        <span className="absolute h-px w-3 bg-current" />
                        <span
                          className={`absolute h-3 w-px bg-current transition-transform duration-300 motion-reduce:transition-none ${
                            open ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  {/* grid-rows 0fr -> 1fr animates the height without measuring it */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!open}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[760px] pb-6 pr-10 text-[14.5px] leading-[1.75] text-[#2A4879]">
                        {f.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
