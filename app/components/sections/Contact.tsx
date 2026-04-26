'use client'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">05.</span>
          <span className="section-label">Contact</span>
        </div>
        <h2 className="reveal">Let&apos;s talk.</h2>
        <p className="section-lede reveal">
          Tell me briefly what you&apos;re working on. I reply within two working days —
          usually the same day. No pitches, no CRM automation.
        </p>

        <a
          href="https://cal.com/grzegorz-karolak/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-call reveal"
        >
          <span className="contact-call-stripe" aria-hidden="true" />
          <span className="contact-call-body">
            <span className="contact-call-eyebrow">Fast path</span>
            <span className="contact-call-title">Book a 15-minute intro call</span>
            <span className="contact-call-meta">
              Pick a time that works · Cal.com · EU-hosted · No agenda required
            </span>
          </span>
          <span className="contact-call-cta">
            Book now
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>

        <div className="contact-or reveal">
          <span className="contact-or-text">Or — write a message</span>
        </div>

        <div className="contact-grid reveal">
          <div className="contact-form-wrap">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Prototype — wire this to Lambda in Step 07.')
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="f-name">Name</label>
                <input
                  type="text"
                  id="f-name"
                  className="form-input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-email">Email</label>
                <input
                  type="email"
                  id="f-email"
                  className="form-input"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-company">
                  Company (optional)
                </label>
                <input
                  type="text"
                  id="f-company"
                  className="form-input"
                  placeholder="Company name"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-message">
                  What are you working on?
                </label>
                <textarea
                  id="f-message"
                  className="form-textarea"
                  placeholder="Brief context helps me reply usefully."
                  required
                />
              </div>
              <button type="submit" className="form-submit">
                Send message
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          <aside className="contact-details">
            <div className="contact-details-item">
              <span className="contact-details-label">Email</span>
              <div className="contact-details-value">
                <a href="mailto:hello@gk-consulting.eu">hello@gk-consulting.eu</a>
              </div>
            </div>
            <div className="contact-details-item">
              <span className="contact-details-label">LinkedIn</span>
              <div className="contact-details-value">
                <a
                  href="https://www.linkedin.com/in/grzegorz-karolak"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /in/grzegorz-karolak
                </a>
              </div>
            </div>
            <div className="contact-details-item">
              <span className="contact-details-label">Based in</span>
              <div className="contact-details-value">
                Poland · EU
                <br />
                Remote · Travel to DACH on request
              </div>
            </div>
            <div className="contact-details-item">
              <span className="contact-details-label">Working hours</span>
              <div className="contact-details-value">
                Mon – Fri · 09:00 – 18:00 CET
              </div>
            </div>
            <div className="contact-details-item">
              <span className="contact-details-label">Languages</span>
              <div className="contact-details-value">
                English · Polish
                <br />
                Working with German clients
              </div>
            </div>
            <div className="contact-details-item">
              <span className="contact-details-label">Response time</span>
              <div className="contact-details-value">
                Within 2 working days · Or book a call directly →
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
