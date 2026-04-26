export default function About() {
  return (
    <section className="section" id="about">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">01.</span>
          <span className="section-label">About</span>
        </div>

        <div className="about-intro reveal">
          <div className="portrait" aria-hidden="true">GK</div>
          <div>
            <div className="portrait-meta">Grzegorz Karolak</div>
            <div className="portrait-name">Principal Architect &amp; Founder</div>
            <div className="portrait-role">
              GK Consulting &middot; Poland &middot; Serving clients across Europe
            </div>
          </div>
        </div>

        <div className="prose reveal">
          <p>
            I&apos;m a <strong>Java &amp; AWS architect</strong> who has spent the last several
            years designing and delivering production systems across fintech, medtech, real estate,
            and industrial IoT. I hold both the AWS Solutions Architect Professional and Associate
            certifications, but more importantly I have the scars to prove I&apos;ve used them
            — leading legacy PHP-to-Kotlin migrations, building IoT platforms for power grid
            operators, and shipping serverless systems that run for cents a month.
          </p>
          <p>
            GK Consulting is a <strong>solo practice by design</strong>. You work with me
            directly, not a project manager forwarding emails to a team in a different time zone.
            When you engage me for architecture, I write the code. When you engage me for a
            migration, I lead it end-to-end. When I don&apos;t know something, I tell you.
          </p>
          <blockquote className="pullquote">
            I don&apos;t just draw diagrams. I write code, lead teams, and deliver working
            systems.
          </blockquote>
          <p>
            Based in Poland, serving clients across Europe. EU-hosted infrastructure,
            GDPR-native, and fluent in the engineering culture of mid-market DACH companies.
          </p>
        </div>

        <div className="aws-badges reveal">
          <span className="aws-badges-label">Verified Credentials</span>
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
