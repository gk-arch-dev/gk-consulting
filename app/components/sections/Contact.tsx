'use client'

import { useState } from 'react'

type Fields = { name: string; email: string; company: string; message: string }
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY: Fields = { name: '', email: '', company: '', message: '' }
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Fields, true>>>({})
  const [status, setStatus] = useState<Status>('idle')

  function update(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }))
      setFieldErrors((fe) => { const n = { ...fe }; delete n[key]; return n })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setFieldErrors({})

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (res.ok) {
        setFields(EMPTY)
        setStatus('success')
        return
      }

      if (res.status === 400) {
        const data = await res.json()
        const errs: Partial<Record<keyof Fields, true>> = {}
        for (const field of (data.errors ?? [])) {
          errs[field as keyof Fields] = true
        }
        setFieldErrors(errs)
        setStatus('idle')
        return
      }

      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'

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
            {status === 'success' ? (
              <p className="contact-success">
                <em>Thanks. I&apos;ll reply within two working days.</em>
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="f-name">Name</label>
                  <input
                    type="text"
                    id="f-name"
                    className={`form-input${fieldErrors.name ? ' form-input--error' : ''}`}
                    placeholder="Your name"
                    value={fields.name}
                    onChange={update('name')}
                    disabled={sending}
                    required
                  />
                  {fieldErrors.name && (
                    <span className="form-field-error">Please enter your name.</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="f-email">Email</label>
                  <input
                    type="email"
                    id="f-email"
                    className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
                    placeholder="you@company.com"
                    value={fields.email}
                    onChange={update('email')}
                    disabled={sending}
                    required
                  />
                  {fieldErrors.email && (
                    <span className="form-field-error">Please enter a valid email address.</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="f-company">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    id="f-company"
                    className={`form-input${fieldErrors.company ? ' form-input--error' : ''}`}
                    placeholder="Company name"
                    value={fields.company}
                    onChange={update('company')}
                    disabled={sending}
                  />
                  {fieldErrors.company && (
                    <span className="form-field-error">Company name is too long.</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="f-message">
                    What are you working on?
                  </label>
                  <textarea
                    id="f-message"
                    className={`form-textarea${fieldErrors.message ? ' form-input--error' : ''}`}
                    placeholder="Brief context helps me reply usefully."
                    value={fields.message}
                    onChange={update('message')}
                    disabled={sending}
                    required
                  />
                  {fieldErrors.message && (
                    <span className="form-field-error">
                      Message must be between 10 and 5,000 characters.
                    </span>
                  )}
                </div>

                <button type="submit" className="form-submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
                  {!sending && (
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
                  )}
                </button>

                {status === 'error' && (
                  <p className="form-global-error">
                    Something went wrong. Please email me directly at{' '}
                    <a href="mailto:hello@gk-consulting.eu">hello@gk-consulting.eu</a>.
                  </p>
                )}
              </form>
            )}
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
