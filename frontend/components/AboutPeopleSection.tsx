import Image from "next/image";
import { manrope } from "@/app/fonts";

type Props = {
  heading?: string | null;
  paragraphs?: string[] | null;
  image?: string | null;
  imageAlt?: string | null;
};

export default function AboutPeopleSection({
  heading,
  paragraphs,
  image,
  imageAlt,
}: Props) {
  const texts = (paragraphs ?? []).filter((p) => p?.trim());

  return (
    <section
      id="our-people"
      aria-labelledby="people-heading"
      className="scroll-mt-24 bg-white py-16 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1338px] items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-14 lg:px-12">
        <div>
          <h2
            id="people-heading"
            className={`${manrope.className} text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3rem]`}
          >
            {heading || "Our People"}
          </h2>
          <div className="mt-6 max-w-[420px] space-y-4 text-[15px] leading-[1.65] text-[#1E3A72]">
            {texts.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#0C225E]">
            <Image
              src={image}
              alt={imageAlt || ""}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
