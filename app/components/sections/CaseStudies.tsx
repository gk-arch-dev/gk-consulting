import Link from 'next/link'
import { getAllCaseStudies } from '@/lib/content'

export default function CaseStudies() {
  const cases = getAllCaseStudies().slice(0, 3)

  return (
    <section className="section" id="work">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">03.</span>
          <span className="section-label">Case Studies</span>
        </div>
        <h2 className="reveal">Selected work.</h2>

        {cases.map((c) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}/`}
            className="case reveal"
          >
            <span className="case-tag">{c.tag}</span>
            <h3>{c.title}</h3>
            <p className="case-desc">{c.thesis}</p>
            <div className="case-meta">
              <div className="case-meta-item">
                <span className="case-meta-label">Role</span>
                <span className="case-meta-value">{c.role}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Client</span>
                <span className="case-meta-value">{c.industry}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Duration</span>
                <span className="case-meta-value">{c.duration}</span>
              </div>
            </div>
            <div className="case-metric">
              <span className="case-metric-label">Outcome</span>
              <span className="case-metric-text">
                {c.outcomeMetric} — {c.outcomeLabel}
              </span>
            </div>
            <div className="case-footer">
              <div className="case-stack">
                {c.stack.slice(0, 5).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <span className="case-arrow">read_case_study →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
