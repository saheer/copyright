import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { manrope } from "@/app/fonts";

// Renders the "Body" field of a Digital Digest post with the typography of the design:
// 17px navy body text, bold Manrope headings, rounded images with a small caption.

type BodyImage = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  caption?: string | null;
};

// Only allow safe link targets, whatever is stored in the CMS
const isSafeHref = (href?: string) =>
  !!href && /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href);

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-[17px] leading-[1.9] text-[#2A4879]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2
        className={`${manrope.className} mt-14 text-[1.7rem] font-bold leading-tight tracking-[-0.005em] text-[#081F5C] lg:text-[2rem]`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`${manrope.className} mt-10 text-[1.35rem] font-bold leading-tight text-[#081F5C] lg:text-[1.55rem]`}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={`${manrope.className} mt-8 text-lg font-bold leading-tight text-[#081F5C]`}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`${manrope.className} mt-8 border-l-4 border-brand-cyan pl-6 text-xl font-semibold leading-snug text-[#081F5C]`}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.8] text-[#2A4879] marker:text-brand-cyan">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.8] text-[#2A4879] marker:font-semibold marker:text-brand-blue">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#081F5C]">{children}</strong>
    ),
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      if (!isSafeHref(href)) return <>{children}</>;
      const external = /^https?:\/\//i.test(href!);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-brand-blue underline underline-offset-4 transition-colors hover:text-[#0E2F6E]"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: BodyImage }) => {
      if (!value?.url) return null;
      return (
        <figure className="mt-10">
          <Image
            src={value.url}
            alt={value.alt || ""}
            width={value.width || 1600}
            height={value.height || 900}
            sizes="(min-width: 920px) 840px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
          {value.caption && (
            <figcaption className="mt-3 text-[13px] leading-snug text-[#7C8BA8]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableTextBody({ value }: { value?: unknown[] | null }) {
  if (!value || value.length === 0) return null;
  // The first element must not add top margin: the section above provides the space
  return (
    <div className="[&>*:first-child]:mt-0">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
