import {revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

// Sanity webhook target: POST /api/revalidate?secret=YOUR_SECRET
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({message: 'Invalid secret'}, {status: 401})
  }
  // Studio content feeding the site: "Home Page", "Digital Footprint Page",
  // "Contact Us", "Footer", "About", "Our Technology" and the Digital Digest posts
  revalidateTag('home', 'max')
  revalidateTag('digitalFootprintPage', 'max')
  revalidateTag('digitalDigest', 'max')
  revalidateTag('contact', 'max')
  revalidateTag('footer', 'max')
  revalidateTag('about', 'max')
  revalidateTag('ourTechnology', 'max')
  revalidateTag('services', 'max')
  revalidateTag('seo', 'max') // SEO fields of every page
  return NextResponse.json({revalidated: true})
}