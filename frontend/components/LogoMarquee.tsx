import Image from 'next/image'

type Logo = {
  _key: string
  name?: string | null
  url: string
  width?: number | null
  height?: number | null
}

const SECONDS_PER_LOGO = 4 // lower = faster
const MIN_ITEMS_PER_HALF = 8 // keeps the track wider than the screen

export default function LogoMarquee({logos}: {logos?: Logo[] | null}) {
  const valid = (logos ?? []).filter((l) => l?.url)
  if (valid.length === 0) return null

  // Repeat a short list so one half of the track always fills the screen
  const reps = Math.ceil(MIN_ITEMS_PER_HALF / valid.length)
  const half = Array.from({length: reps}, () => valid).flat()

  return (
    <section
      aria-label="Our partners and clients"
      className="overflow-hidden border-b border-gray-200 bg-white py-10 lg:py-14"
    >
      <div
        className="marquee-track flex w-max"
        style={{animationDuration: `${half.length * SECONDS_PER_LOGO}s`}}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            // the second copy only exists for the seamless loop
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24"
          >
            {half.map((logo, i) => (
              <li key={`${logo._key}-${i}`} className="shrink-0">
                <Image
                  src={logo.url}
                  alt={copy === 1 ? '' : logo.name || ''}
                  width={logo.width || 214}
                  height={logo.height || 190}
                  className="h-20 w-auto mix-blend-multiply md:h-24 lg:h-28"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
