import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCaseStudies } from '@/lib/content'
import CaseStudiesArchive from '@/components/blog/CaseStudiesArchive'

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Independent consulting engagements across fintech, real estate, medtech, and industrial IoT. Each one a different problem; the architectural pattern is the same.',
  alternates: { canonical: '/case-studies/' },
  openGraph: { url: '/case-studies/' },
}

export default function CaseStudiesPage() {
  const cases = getAllCaseStudies()
  const years = cases.map((c) => c.year)
  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)
  const industries = new Set(cases.map((c) => c.industry.split(' · ')[0]))

  return (
    <main>
      <div className="spine breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">GK Consulting</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Case Studies</span>
        </div>
      </div>

      <section className="spine page-hero">
        <span className="page-eyebrow">Selected Work</span>
        <h1>
          Case <em>studies.</em>
        </h1>
        <p className="page-lede">
          Independent consulting engagements across fintech, real estate, medtech, and
          industrial IoT. Each one a different problem; the architectural pattern is the
          same.
        </p>
        <div className="page-meta">
          <span>
            <strong style={{ color: 'var(--ink)' }}>{cases.length}</strong> studies
          </span>
          <span className="page-meta-sep">·</span>
          <span>Across {industries.size} industries</span>
          <span className="page-meta-sep">·</span>
          <span>
            {firstYear}—{lastYear}
          </span>
        </div>
      </section>

      <CaseStudiesArchive cases={cases} />

      <section className="spine cta-strip">
        <div className="cta-strip-text">
          <span className="cta-strip-eyebrow">Have a similar problem?</span>
          <span className="cta-strip-title">Let&apos;s see if I can help.</span>
        </div>
        <div className="cta-strip-actions">
          <Link href="/#contact" className="btn-primary">
            Book a 15-min call
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
