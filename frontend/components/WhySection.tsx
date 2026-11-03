import Image from "next/image";
import { loadSvg } from "@/sanity/lib/inlineSvg";

type Feature = {
  _key: string;
  title: string;
  highlight?: string | null;
  description?: string | null;
  icon?: string | null;
  iconType?: string | null;
};

type Props = {
  mediaType?: "image" | "video" | null;
  videoUrl?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  hotspot?: { x: number; y: number } | null;
  features?: Feature[] | null;
};

// Default icons (frontend/public/icons/why), used when none is uploaded in Sanity
const FALLBACK_ICONS = [
  "icons/why/continuous-intelligence.svg",
  "icons/why/targeted-enforcement.svg",
  "icons/why/measurable-results.svg",
];

const iconBox =
  "block h-16 w-16 shrink-0 drop-shadow-[0_0_14px_rgba(0,174,239,0.45)] lg:h-20 lg:w-20";

async function FeatureIcon({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const isRaster =
    !!feature.icon && !!feature.iconType && !feature.iconType.includes("svg");
  if (isRaster) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={feature.icon!}
        alt=""
        width={80}
        height={80}
        className={iconBox}
      />
    );
  }
  const svg = await loadSvg(feature.icon, FALLBACK_ICONS[index]);
  if (!svg) return <span aria-hidden className={iconBox} />;
  return (
    <span
      aria-hidden
      className={`${iconBox} [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function WhySection({
  mediaType,
  videoUrl,
  image,
  imageAlt,
  hotspot,
  features,
}: Props) {
  const items = (features ?? []).filter((f) => f?.title);
  if (items.length === 0 && !image && !videoUrl) return null;

  const objectPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;
  // A video is only used when "Video" is selected AND a file / URL exists
  const showVideo = mediaType === "video" && !!videoUrl;

  return (
    <section
      aria-label="Why Copyright Integrity"
      className="grid w-full grid-cols-1 bg-[#03112D] lg:grid-cols-2"
    >
      {/* Left: video or image, edge to edge */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#020b1f] lg:aspect-auto lg:min-h-[560px]">
        {showVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition }}
            src={videoUrl!}
            poster={image ?? undefined}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : image ? (
          <Image
            src={image}
            alt={imageAlt || ""}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={{ objectPosition }}
            className="object-cover"
          />
        ) : null}
      </div>

      {/* Right: dark panel with feature rows */}
      <div className="relative flex flex-col justify-center bg-[radial-gradient(ellipse_at_top_right,rgba(0,174,239,0.16),transparent_60%)] px-8 py-10 sm:px-12 lg:px-16 xl:px-24">
        <ul className="divide-y divide-white/10">
          {items.map((feature, i) => (
            <li
              key={feature._key}
              className="flex items-center gap-6 py-9 first:pt-0 last:pb-0 lg:gap-10 lg:py-12"
            >
              <FeatureIcon feature={feature} index={i} />
              <div>
                <h3 className="text-3xl font-bold leading-[1.1] tracking-tight text-white lg:text-4xl">
                  {feature.title}
                  {feature.highlight && (
                    <span className="block text-brand-cyan">
                      {feature.highlight}
                    </span>
                  )}
                </h3>
                {feature.description && (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#818896] lg:text-base">
                    {feature.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
