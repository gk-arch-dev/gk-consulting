import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies · GK Consulting',
  description: 'Selected consulting engagements across fintech, real estate, medtech, and industrial IoT.',
}

export default function CaseStudiesPage() {
  return (
    <div style={{ paddingTop: '140px' }}>
      <div className="spine">
        <h1>Case Studies</h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: '16px' }}>
          Step 05 will build this out.
        </p>
      </div>
    </div>
  )
}
