import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts, getAllTags } from '@/lib/content'
import BlogArchive from '@/components/blog/BlogArchive'

export const metadata: Metadata = {
  title: 'Blog — Notes from the field · GK Consulting',
  description:
    'Architecture decisions, AWS deep dives, and engineering patterns from production. Independent Java & AWS architecture consulting from the EU.',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const tags = getAllTags()
  const latest = posts[0]?.date ?? ''

  function formatLatest(d: string) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${y} · ${m} · ${day}`
  }

  return (
    <main>
      <div className="spine breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">GK Consulting</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Blog</span>
        </div>
      </div>

      <section className="spine page-hero">
        <span className="page-eyebrow">Archive</span>
        <h1>
          The <em>blog.</em>
        </h1>
        <p className="page-lede">
          Posts on architecture, modernization, and engineering practice. Mostly long-form.
          Roughly one every two weeks.
        </p>
        <div className="page-meta">
          <span>
            <strong style={{ color: 'var(--ink)' }}>{posts.length}</strong> posts
          </span>
          <span className="page-meta-sep">·</span>
          <span>Updated {formatLatest(latest)}</span>
        </div>
      </section>

      <BlogArchive posts={posts} tags={tags} />

      <section className="spine cta-strip">
        <div className="cta-strip-text">
          <span className="cta-strip-eyebrow">Want to discuss something I wrote?</span>
          <span className="cta-strip-title">Book a 15-min call.</span>
        </div>
        <div className="cta-strip-actions">
          <Link href="/#contact" className="btn-primary">
            Book a call
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/" className="btn-ghost">Back to home</Link>
        </div>
      </section>
    </main>
  )
}
