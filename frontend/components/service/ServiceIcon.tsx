import Image from "next/image";

// Renders, in order of preference:
//   1. inline SVG markup (from the inline-SVG field)  -> <img> with a data URI
//   2. an image/file URL from Sanity                  -> next/image (SVGs are served as-is)
//   3. nothing / anything else                        -> the neutral check-mark icon
export default function ServiceIcon({
  src,
  className = "h-12 w-12",
}: {
  src?: unknown;
  className?: string;
}) {
  if (typeof src === "string") {
    const value = src.trim();

    if (value.startsWith("<")) {
      // A standalone SVG needs xmlns to render inside <img>
      const markup = /xmlns\s*=/.test(value)
        ? value
        : value.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      return (
        // An <img> data URI never runs scripts inside the SVG, so this is safe
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(markup)}`}
          alt=""
          className={`${className} object-contain`}
        />
      );
    }

    if (value.startsWith("http")) {
      return (
        <Image
          src={value}
          alt=""
          width={96}
          height={96}
          className={`${className} object-contain`}
        />
      );
    }
  }

  // Default icon: only reached when no usable icon was received
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`${className} text-brand-cyan`}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}
