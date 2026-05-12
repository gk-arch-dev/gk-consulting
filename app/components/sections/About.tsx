export default function About() {
  return (
    <section className="section" id="about">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">01.</span>
          <span className="section-label">About</span>
        </div>

        <div className="about-intro reveal">
          <div className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/picture.jpg"
              alt="Grzegorz Karolak — Java and AWS architect"
              width={88}
              height={104}
            />
          </div>
          <div>
            <div className="portrait-meta">Grzegorz Karolak</div>
            <div className="portrait-name">Solutions Architect &amp; Engineer</div>
            <div className="portrait-role">
              GK Consulting &middot; Poland &middot; Serving clients across Europe
            </div>
          </div>
        </div>

        <div className="prose reveal">
          <p>
            I&apos;m <strong>Grzegorz Karolak</strong>, a{' '}
            <strong>Java and AWS architect</strong>{' '}and engineer, based in Poland
            and working with clients across Europe. You work with me directly — no project manager
            translating between you and a team in a different time zone, no junior
            swap-out partway through. Engagements range from focused architecture reviews to multi-month
            end-to-end builds where I write code, lead the team, and ship the system.
            I scope to what you need, not to fill a calendar. It&apos;s the right shape when continuity of ownership
            matters more than team size — and I&apos;ll tell you up front when it
            isn&apos;t.
          </p>
          <p>
            The proof: AWS Solutions Architect Professional and Associate
            certifications. A PHP-to-Kotlin migration for a German real-estate
            platform, an
            IoT backend over gRPC and MQTT for a Swiss power-grid operator, a
            portfolio management modernization for a Swiss financial institution, and a
            medical-device companion platform for a UK medtech startup. Production
            systems, not pilots.
          </p>
          <blockquote className="pullquote">
            I don&apos;t just draw diagrams. I design, build, and ship working
            systems — pragmatic, business-focused, AI in the workflow.
          </blockquote>
          <p>
            My default stack is <strong>Kotlin or Java on Spring Boot</strong>{' '}
            for services and serverless on AWS for the edges. I&apos;m comfortable
            across the stack, including React and TypeScript front-ends and IaC tools.
            AI tooling like Claude Code earns its place in the workflow: faster
            scaffolding, tighter review loops, more time on the work that needs
            judgment. The decisions are still mine.
          </p>
        </div>

        <div className="aws-badges reveal" aria-label="AWS Certifications">
          <span className="aws-badges-label">Verified Credentials</span>
          <span className="aws-badges-meta">EU-based &middot; GDPR-aligned</span>
          <div className="aws-badges-row">
            <a
              href="https://www.credly.com/badges/d2d48f47-4b91-4a27-bcfc-668fa325bffc/public_url"
              className="aws-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View AWS Solutions Architect Professional certification on Credly"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aws-sap.png"
                alt="AWS Certified Solutions Architect – Professional badge"
                width={64}
                height={64}
              />
              <span className="aws-badge-text">
                <span className="aws-badge-name">Solutions Architect</span>
                <span className="aws-badge-issuer">Professional &middot; Amazon Web Services</span>
                <span className="aws-badge-link">Verify on Credly →</span>
              </span>
            </a>
            <a
              href="https://www.credly.com/badges/45327add-e316-45c3-a80c-c83afe333222/linked_in_profile"
              className="aws-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View AWS Solutions Architect Associate certification on Credly"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aws-saa.png"
                alt="AWS Certified Solutions Architect – Associate badge"
                width={64}
                height={64}
              />
              <span className="aws-badge-text">
                <span className="aws-badge-name">Solutions Architect</span>
                <span className="aws-badge-issuer">Associate &middot; Amazon Web Services</span>
                <span className="aws-badge-link">Verify on Credly →</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
