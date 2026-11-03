import Image from "next/image";
import { manrope } from "@/app/fonts";

type Client = {
  _key: string;
  name?: string | null;
  url?: string | null;
  logo?: string | null;
};

type Props = {
  heading?: string | null;
  subtitle?: string | null;
  clients?: Client[] | null;
};

const cardCls =
  "group flex h-[130px] items-center justify-center rounded-lg border border-[#E3E9F3] bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#C9D6EA] hover:shadow-[0_20px_44px_-20px_rgba(10,26,58,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#229FCB] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[160px] lg:h-[196px]";

export default function TrustedClientsSection({
  heading,
  subtitle,
  clients,
}: Props) {
  const logos = (clients ?? []).filter((c) => c?.logo);
  if (logos.length === 0) return null;

  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="scroll-mt-24 pb-16 pt-16 lg:pb-24 lg:pt-24"
    >
      <div className="mx-auto max-w-[1338px] px-6 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.48fr)_minmax(0,1fr)] lg:items-end">
          <h2
            id="clients-heading"
            className={`${manrope.className} max-w-[480px] text-4xl font-bold leading-[1.1] tracking-tight text-[#002060] lg:text-[3rem]`}
          >
            {heading || "Trusted to protect what matters."}
          </h2>
          {subtitle && (
            <p className="max-w-[400px] text-[15px] leading-[1.6] text-[#1E3A72] lg:pb-2">
              {subtitle}
            </p>
          )}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {logos.map((c) => {
            const name = c.name || "Client logo";
            const logo = (
              <span className="relative block h-full max-h-[96px] w-full max-w-[190px]">
                <Image
                  src={c.logo as string}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                />
              </span>
            );
            return (
              <li key={c._key}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (opens in a new tab)`}
                    className={cardCls}
                  >
                    {logo}
                  </a>
                ) : (
                  <div className={cardCls}>{logo}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
