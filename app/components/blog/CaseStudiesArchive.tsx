'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CaseStudy } from '@/lib/content'

const ENGAGEMENT_DISPLAY: Record<string, string> = {
  modernization: 'Modernization',
  greenfield: 'Greenfield',
  embedded: 'Embedded Tech Lead',
}

interface Props {
  cases: CaseStudy[]
}

export default function CaseStudiesArchive({ cases }: Props) {
  const [active, setActive] = useState('all')

  const engagementCounts = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.engagement] = (acc[c.engagement] ?? 0) + 1
    return acc
  }, {})

  const engagements = Object.keys(engagementCounts)

  return (
    <>
      <section className="spine filters">
        <span className="filters-label">Filter by engagement</span>
        <div className="filter-pills" role="group" aria-label="Engagement type filter">
          <button
            className={`filter-pill${active === 'all' ? ' active' : ''}`}
            onClick={() => setActive('all')}
          >
            All <span className="filter-count">{cases.length}</span>
          </button>
          {engagements.map((eng) => (
            <button
              key={eng}
              className={`filter-pill${active === eng ? ' active' : ''}`}
              onClick={() => setActive(eng)}
            >
              {ENGAGEMENT_DISPLAY[eng] ?? eng}{' '}
              <span className="filter-count">{engagementCounts[eng]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="spine archive">
        <ul className="case-list">
          {cases.map((c) => {
            const hidden = active !== 'all' && c.engagement !== active
            return (
              <li key={c.slug} className={hidden ? 'hidden' : ''}>
                <Link href={`/case-studies/${c.slug}/`} className="case-row">
                  <div className="case-left">
                    <span className="case-year">{c.year}</span>
                    <span className="case-type">
                      {ENGAGEMENT_DISPLAY[c.engagement] ?? c.engagement}
                    </span>
                  </div>
                  <div className="case-text">
                    <h3 className="case-title">{c.title}</h3>
                    <p className="case-thesis">{c.thesis}</p>
                    <p className="case-meta-line">
                      <strong>Industry</strong> {c.industry}
                      <span className="case-meta-sep">·</span>
                      <strong>Stack</strong> {c.stack.slice(0, 4).join(' · ')}
                      <span className="case-meta-sep">·</span>
                      <strong>Duration</strong> {c.duration}
                    </p>
                  </div>
                  <div className="case-outcome">
                    <span className="case-outcome-num">{c.outcomeMetric}</span>
                    <span className="case-outcome-label">{c.outcomeLabel}</span>
                    <span className="case-arrow">read_case →</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {active !== 'all' && cases.every((c) => c.engagement !== active) && (
          <div className="empty-state visible">
            No case studies in this category — yet.
          </div>
        )}

        <div className="confidential">
          <span className="confidential-label">Not shown here</span>
          <h3>Some clients prefer not to be named.</h3>
          <p>
            The pages above are the engagements I can write about publicly.{' '}
            <strong>
              Other work — including more recent projects under active NDA — applies
              the same patterns and produced comparable outcomes.
            </strong>{' '}
            If you&apos;re evaluating me for a similar problem, I&apos;m happy to walk through
            the relevant work on a call, with redactions where needed.
          </p>
        </div>
      </section>
    </>
  )
}
