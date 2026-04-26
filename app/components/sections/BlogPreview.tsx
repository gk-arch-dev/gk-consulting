const posts = [
  {
    slug: 'strangler-fig-in-practice',
    date: '2026 · 03 · 18',
    title: 'Strangler Fig in Practice: Lessons from a Real Migration',
    thesis: 'Why most strangler-fig projects stall at 60% — and how to plan around it from day one.',
    readTime: '12 min',
  },
  {
    slug: 'api-gateway-authorization',
    date: '2026 · 02 · 24',
    title: 'API Gateway Authorization: JWT, IAM, or Lambda Authorizer?',
    thesis: 'Three patterns, three blast radii. A decision framework based on what you\'re actually protecting.',
    readTime: '9 min',
  },
  {
    slug: 'event-driven-architecture-aws',
    date: '2026 · 02 · 06',
    title: 'Event-Driven Architecture on AWS: A Complete Comparison of SNS, SQS, EventBridge, and Kinesis for Modern Systems',
    thesis: 'A deep architectural comparison of every messaging primitive AWS offers, with concrete throughput numbers, ordering guarantees, retry semantics, and cost analysis.',
    readTime: '14 min',
  },
  {
    slug: 'kotlin-over-java-2026',
    date: '2026 · 01 · 20',
    title: 'Why I Choose Kotlin Over Java for New Backend Projects in 2026',
    thesis: 'Six concrete language features that change how you architect Spring Boot services — without sacrificing JVM compatibility.',
    readTime: '7 min',
  },
  {
    slug: 'cdk-vs-terraform',
    date: '2025 · 12 · 11',
    title: 'CDK vs Terraform: A Pragmatic Decision Framework',
    thesis: "Skip the religious war. The right answer depends on your team's language, blast radius, and audit story.",
    readTime: '10 min',
  },
  {
    slug: 'serverless-ceiling',
    date: '2025 · 11 · 28',
    title: 'The Serverless Ceiling: When to Reach for ECS Instead',
    thesis: 'The four signals that tell you Lambda is no longer the right tool — before your invoice does.',
    readTime: '8 min',
  },
]

export default function BlogPreview() {
  return (
    <section className="section" id="blog">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">04.</span>
          <span className="section-label">Blog</span>
        </div>
        <h2 className="reveal">Notes from the field.</h2>
        <p className="section-lede reveal">
          Architecture decisions, AWS deep dives, and engineering patterns I&apos;ve seen
          in production.
        </p>

        <div className="blog-list-header reveal">
          <span className="blog-list-label">Recent</span>
        </div>
        <ul className="blog-list reveal">
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}/`} className="blog-entry">
                <span className="blog-date">{post.date}</span>
                <span className="blog-text">
                  <h3>{post.title}</h3>
                  <span className="blog-thesis">{post.thesis}</span>
                </span>
                <span className="blog-meta">
                  <span>{post.readTime}</span>
                  <span className="blog-arrow">→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a href="/blog" className="view-all">
          All posts → archive
        </a>
      </div>
    </section>
  )
}
