const cases = [
  {
    slug: 'php-to-aws-migration',
    tag: 'Legacy Modernization · Real Estate',
    title: 'Legacy PHP Monolith → Cloud-Native on AWS',
    desc: 'Led a full rewrite of a legacy PHP application into a Kotlin & Spring Boot platform running cloud-native on AWS for a German real estate company. Managed the migration as Tech Lead — architecture, delivery, team coordination.',
    role: 'Tech Lead',
    client: 'DE · Real Estate',
    duration: '18 months',
    outcome: '200K+ users migrated · Delivered on schedule · Zero downtime cutover',
    stack: ['Kotlin', 'Spring Boot', 'AWS', 'PostgreSQL', 'React'],
  },
  {
    slug: 'iot-power-grid',
    tag: 'Backend Architecture · Industrial IoT',
    title: 'IoT Management Platform for Power Grid',
    desc: 'Designed and built backend services for an IoT system managing power distribution networks. Event-driven architecture handling telemetry from thousands of field devices, with operator dashboards and alerting.',
    role: 'Backend Architect',
    client: 'EU · Utilities',
    duration: '12 months',
    outcome: 'Sub-second event processing · 99.95% ingestion SLA',
    stack: ['Java', 'Kafka', 'Spring Boot', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'serverless-financial-monitor',
    tag: 'Serverless · Fintech',
    title: 'Real-Time Financial Data Monitor',
    desc: 'Designed and delivered a fully serverless monitoring system for a fintech client. React frontend, Lambda backend, DynamoDB storage, CQRS pattern, and fully automated infrastructure with CDK.',
    role: 'Solo Delivery',
    client: 'EU · Fintech',
    duration: '4 months',
    outcome: 'Sub-second data refresh · Zero ops overhead · < $200/mo infra',
    stack: ['React', 'Lambda', 'DynamoDB', 'CDK', 'CloudFront'],
  },
]

export default function CaseStudies() {
  return (
    <section className="section" id="work">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">03.</span>
          <span className="section-label">Case Studies</span>
        </div>
        <h2 className="reveal">Selected work.</h2>

        {cases.map((c) => (
          <a
            key={c.slug}
            href={`/case-studies/${c.slug}/`}
            className="case reveal"
          >
            <span className="case-tag">{c.tag}</span>
            <h3>{c.title}</h3>
            <p className="case-desc">{c.desc}</p>
            <div className="case-meta">
              <div className="case-meta-item">
                <span className="case-meta-label">Role</span>
                <span className="case-meta-value">{c.role}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Client</span>
                <span className="case-meta-value">{c.client}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Duration</span>
                <span className="case-meta-value">{c.duration}</span>
              </div>
            </div>
            <div className="case-metric">
              <span className="case-metric-label">Outcome</span>
              <span className="case-metric-text">{c.outcome}</span>
            </div>
            <div className="case-footer">
              <div className="case-stack">
                {c.stack.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <span className="case-arrow">read_case_study →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
