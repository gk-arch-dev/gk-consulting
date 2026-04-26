import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GK Consulting — Java & AWS Architect for European Companies',
  description:
    'Java & AWS architect helping European engineering leaders design, build, and modernize backend systems on AWS.',
}

export default function HomePage() {
  return (
    <div style={{ paddingTop: '140px' }}>
      <div className="spine">
        <h1>GK Consulting — Homepage</h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: '16px' }}>
          Step 04 will build this out.
        </p>
      </div>
    </div>
  )
}
