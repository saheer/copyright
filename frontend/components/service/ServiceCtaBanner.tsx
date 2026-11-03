import Link from "next/link";
import { manrope } from "@/app/fonts";

type Props = {
  eyebrow?: string | null;
  heading?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  link?: string | null;
};

export default function ServiceCtaBanner({
  eyebrow,
  heading,
  text,
  buttonLabel,
  link,
}: Props) {
  const href = link || "/contact-us";
  const external = /^https?:\/\//i.test(href);
  const btnCls =
    "group/btn inline-flex shrink-0 items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-brand-cyan hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400";
  const content = (
    <>
      {buttonLabel || "Get in touch"}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover/btn:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </>
  );

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 rounded-2xl bg-[radial-gradient(120%_160%_at_85%_50%,#0B2A73_0%,#05174A_45%,#030F33_100%)] p-8 shadow-[0_30px_60px_-30px_rgba(10,26,58,0.6)] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div>
            {(eyebrow || "Let’s talk") && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cyan">
                {eyebrow || "Let’s talk"}
              </p>
            )}
            <h2
              className={`${manrope.className} mt-4 max-w-[560px] text-3xl font-bold leading-[1.1] tracking-tight text-white lg:text-[2.5rem]`}
            >
              {heading || "Learn more about our services and pricing."}
            </h2>
            <p className="mt-4 max-w-[520px] text-[13.5px] leading-[1.7] text-white/65">
              {text ||
                "Talk to our team to understand the right protection approach for your content and rights."}
            </p>
          </div>

          {external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={btnCls}
            >
              {content}
            </a>
          ) : (
            <Link href={href} className={btnCls}>
              {content}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
