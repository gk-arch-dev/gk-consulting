import type { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllCaseStudies } from '@/lib/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gkconsulting.cloud'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/case-studies/`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/blog/`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/impressum/`, lastModified: now, priority: 0.1 },
    { url: `${baseUrl}/datenschutz/`, lastModified: now, priority: 0.1 },
  ]

  const blog: MetadataRoute.Sitemap = getAllBlogPosts().map((p) => ({
    url: `${baseUrl}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    priority: 0.7,
  }))

  const cases: MetadataRoute.Sitemap = getAllCaseStudies().map((c) => ({
    url: `${baseUrl}/case-studies/${c.slug}/`,
    lastModified: new Date(`${c.year}-12-31`),
    priority: 0.8,
  }))

  return [...staticPages, ...blog, ...cases]
}
