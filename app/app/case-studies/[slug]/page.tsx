import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllCaseStudies, getCaseStudy } from '@/lib/content'

export async function generateStaticParams() {
  return getAllCaseStudies().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return {
    title: `${cs.title} — GK Consulting`,
    description: cs.description,
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <main>
      <div className="spine breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">GK Consulting</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/case-studies">Case Studies</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{cs.title}</span>
        </div>
      </div>

      <section className="spine case-hero">
        <div className="case-tag reveal">{cs.tag}</div>
        <h1 className="reveal">{cs.title}</h1>
        <p className="case-thesis reveal">{cs.thesis}</p>

        <div className="case-spec reveal">
          <div className="case-spec-item">
            <span className="case-spec-label">Role</span>
            <span className="case-spec-value">{cs.role}</span>
          </div>
          <div className="case-spec-item">
            <span className="case-spec-label">Client</span>
            <span className="case-spec-value">{cs.industry}</span>
          </div>
          <div className="case-spec-item">
            <span className="case-spec-label">Duration</span>
            <span className="case-spec-value">{cs.duration}</span>
          </div>
          <div className="case-spec-item">
            <span className="case-spec-label">Team</span>
            <span className="case-spec-value">{cs.team}</span>
          </div>
        </div>
      </section>

      <section className="spine outcome">
        <span className="outcome-label reveal">Outcome</span>
        <div className="outcome-metrics reveal">
          {cs.metrics.map((m, i) => (
            <div key={i} className="outcome-metric">
              <span className="outcome-metric-num">
                <em>{m.num}</em>
              </span>
              <span className="outcome-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="spine story">
        <span className="story-label reveal">The story</span>
        <h2 className="reveal">What we did.</h2>
        <div className="reveal">
          <MDXRemote
            source={cs.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </section>

      <section className="spine stack">
        <span className="stack-label reveal">Stack</span>
        <div className="tech-tags reveal">
          {cs.stack.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </section>

      {cs.closingQuote && (
        <section className="spine closing">
          <p className="closing-quote reveal">{cs.closingQuote}</p>
        </section>
      )}

      <section className="spine cta-strip">
        <div className="cta-strip-text">
          <span className="cta-strip-eyebrow">Have a similar problem?</span>
          <span className="cta-strip-title">Let&apos;s talk about your migration.</span>
        </div>
        <div className="cta-strip-actions">
          <Link href="/#contact" className="btn-primary">
            Book a 15-min call
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/case-studies" className="btn-ghost">
            All case studies
          </Link>
        </div>
      </section>
    </main>
  )
}
