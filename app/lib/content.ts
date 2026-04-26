import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const CONTENT_ROOT = path.join(process.cwd(), '..', 'content')
const IS_PROD = process.env.NODE_ENV === 'production'

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  thesis: string
  description: string
  readTime: string
  draft?: boolean
  content: string
}

export interface CaseStudy {
  slug: string
  title: string
  year: number
  engagement: 'greenfield' | 'modernization' | 'embedded'
  industry: string
  role: string
  duration: string
  team: string
  tag: string
  thesis: string
  outcomeMetric: string
  outcomeLabel: string
  stack: string[]
  metrics: { num: string; label: string }[]
  closingQuote?: string
  description: string
  content: string
}

export interface TagInfo {
  slug: string
  tag: string
  count: number
}

export const TAG_DISPLAY: Record<string, string> = {
  modernization: 'Legacy Modernization',
  aws: 'AWS',
  architecture: 'Architecture',
  kotlin: 'Kotlin & JVM',
  serverless: 'Serverless',
  practices: 'Practices',
}

export function getAllBlogPosts(): BlogPost[] {
  const dir = path.join(CONTENT_ROOT, 'blog')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const rt = readingTime(content)
      return {
        slug: data.slug as string,
        title: data.title as string,
        date: data.date as string,
        tags: (data.tags as string[]) ?? [],
        thesis: data.thesis as string,
        description: (data.description ?? data.thesis) as string,
        readTime: `${Math.ceil(rt.minutes)} min`,
        draft: data.draft as boolean | undefined,
        content,
      }
    })
    .filter((p) => !IS_PROD || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug)
}

export function getAllTags(): TagInfo[] {
  const posts = getAllBlogPosts()
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const t of post.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({
      slug,
      tag: TAG_DISPLAY[slug] ?? slug,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getAllCaseStudies(): CaseStudy[] {
  const dir = path.join(CONTENT_ROOT, 'case-studies')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: data.slug as string,
        title: data.title as string,
        year: data.year as number,
        engagement: data.engagement as 'greenfield' | 'modernization' | 'embedded',
        industry: data.industry as string,
        role: data.role as string,
        duration: data.duration as string,
        team: data.team as string,
        tag: data.tag as string,
        thesis: data.thesis as string,
        outcomeMetric: data.outcomeMetric as string,
        outcomeLabel: data.outcomeLabel as string,
        stack: (data.stack as string[]) ?? [],
        metrics: (data.metrics as { num: string; label: string }[]) ?? [],
        closingQuote: data.closingQuote as string | undefined,
        description: (data.description ?? data.thesis) as string,
        content,
      }
    })
    .sort((a, b) => b.year - a.year)
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getAllCaseStudies().find((c) => c.slug === slug)
}
