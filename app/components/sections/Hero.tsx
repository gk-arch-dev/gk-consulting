import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-spec" aria-hidden="true">
        <div className="hero-spec-row">
          <span className="hero-spec-key">REV</span>
          <span className="hero-spec-val">2026.04</span>
        </div>
        <div className="hero-spec-row">
          <span className="hero-spec-key">REGION</span>
          <span className="hero-spec-val">eu-central-1</span>
        </div>
        <div className="hero-spec-row">
          <span className="hero-spec-key">STATUS</span>
          <span className="hero-spec-val">
            accepting
            <br />
            new clients
          </span>
        </div>
      </div>
      <div className="spine">
        <div className="hero-mark reveal">
          <span className="hero-mark-dot" aria-hidden="true" />
          GK &middot; Est. 2026 &middot; EU
        </div>
        <div className="hero-eyebrow reveal">Java &amp; AWS Consulting</div>
        <h1 className="reveal">
          I design, build, and modernize backend systems <em>on AWS.</em>
        </h1>
        <p className="hero-lede reveal">
          <strong>Java &amp; AWS architect</strong> helping European engineering leaders
          turn legacy monoliths into scalable, cloud-native platforms — or build new
          ones from scratch. Architecture that ships. Migrations that don&apos;t stall.
          Teams that learn.
        </p>
        <div className="hero-ctas reveal">
          <Link href="/#contact" className="btn-primary">
            Book a discovery call
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
          <Link href="/#work" className="btn-ghost">
            See case studies
          </Link>
        </div>
      </div>
    </section>
  )
}
