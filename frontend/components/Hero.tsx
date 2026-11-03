import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  heroHeadingWhite: string;
  heroHeadingBlue: string;
  heroDescription?: string[] | null;
  heroButtonText?: string | null;
  heroButtonLink?: string | null;
  heroBackground?: string | null;
  heroBackgroundAlt?: string | null;
};

export default function Hero({
  heroHeadingWhite,
  heroHeadingBlue,
  heroDescription,
  heroButtonText,
  heroButtonLink,
  heroBackground,
  heroBackgroundAlt,
}: HeroProps) {
  // Strip any trailing arrow typed in the CMS so only one "→" ever shows
  const buttonLabel = heroButtonText?.replace(/\s*[→➔➜]+\s*$/u, "").trim();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
      {heroBackground && (
        <Image
          src={heroBackground}
          alt={heroBackgroundAlt || ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* darkening overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-16 pt-40 lg:px-12">
        <h1
          style={{ animationDelay: "0ms" }}
          className="animate-fade-up motion-reduce:animate-none max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.6rem]"
        >
          {heroHeadingWhite}
          <span className="block text-brand-cyan">{heroHeadingBlue}</span>
        </h1>

        <div
          style={{ animationDelay: "200ms" }}
          className="w-full max-w-[540px] animate-fade-up motion-reduce:animate-none mt-10 max-w-3xl space-y-4 text-lg leading-relaxed lg:text-xl lg:leading-[1.6]"
        >
          {(heroDescription ?? []).map((p, i) => (
            <p key={i} className={i === 0 ? "text-white/90" : "text-white/60"}>
              {p}
            </p>
          ))}
        </div>

        {buttonLabel && (
          <Link
            href={heroButtonLink || "/about-us"}
            style={{ animationDelay: "400ms" }}
            className="animate-fade-up motion-reduce:animate-none relative isolate mt-12 inline-flex items-center overflow-hidden rounded-full border border-white/70 px-9 py-4 text-base font-semibold text-white transition-[border-color] duration-300 ease-out before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-brand-blue before:transition-transform before:duration-300 before:ease-out hover:border-transparent hover:before:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
          >
            {buttonLabel} →
          </Link>
        )}
      </div>
    </section>
  );
}
