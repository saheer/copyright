import {cacheLife, cacheTag} from 'next/cache'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

// Keep only the <svg>…</svg> part and drop anything executable
export function cleanSvg(raw: string): string | null {
  const m = raw.match(/<svg[\s\S]*<\/svg>/i)
  if (!m) return null
  return m[0]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(xlink:href|href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '')
}

/**
 * Fetches an SVG on the server (so browser/CDN quirks can't break it), cleans it and
 * caches it together with the "home" tag. If the download fails or no URL is given,
 * it reads `public/<fallbackPath>` instead (e.g. "icons/services/live-stream.svg").
 */
export async function loadSvg(
  url: string | null | undefined,
  fallbackPath: string | undefined,
): Promise<string | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('home')

  if (url) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        const svg = cleanSvg(await res.text())
        if (svg) return svg
      }
    } catch {
      /* fall through to the bundled icon */
    }
  }
  if (fallbackPath) {
    try {
      return cleanSvg(await readFile(path.join(process.cwd(), 'public', fallbackPath), 'utf8'))
    } catch {
      /* no bundled icon either */
    }
  }
  return null
}
