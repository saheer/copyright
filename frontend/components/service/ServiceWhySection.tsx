import Image from "next/image";
import { manrope } from "@/app/fonts";

type Props = {
  heading: string;
  text?: string | null;
  points?: string[] | null;
  image?: string | null;
  imageAlt?: string | null;
};

export default function ServiceWhySection({
  heading,
  text,
  points,
  image,
  imageAlt,
}: Props) {
  const list = (points ?? []).filter((p) => p?.trim());
  if (!text && list.length === 0 && !image) return null;

  return (
    <section
      aria-labelledby="service-why-heading"
      className="bg-[#F5F7FB] py-16 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1338px] items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-12">
        <div>
          <h2
            id="service-why-heading"
            className={`${manrope.className} max-w-[520px] text-3xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[2.5rem]`}
          >
            {heading}
          </h2>
          {text && (
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.75] text-[#2A4879]">
              {text}
            </p>
          )}
          {list.length > 0 && (
            <>
              <hr className="my-8 max-w-[520px] border-[#DDE6F2]" />
              <ul className="space-y-3.5">
                {list.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-[14px] font-medium text-[#0C2268]"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {image && (
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#0C225E]">
            <Image
              src={image}
              alt={imageAlt || ""}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
