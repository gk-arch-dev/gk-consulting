import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gkconsulting.cloud'
  return {
    rules: { userAgent: '*', disallow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
