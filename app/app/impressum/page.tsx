import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum · GK Consulting',
  description: 'Legal imprint for GK Consulting.',
  robots: { index: false },
}

export default function ImpressumPage() {
  return (
    <div style={{ paddingTop: '140px', paddingBottom: '80px' }}>
      <div className="spine">
        <h1>Impressum</h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: '24px', fontStyle: 'italic' }}>
          Imprint content to be added. Required for German legal compliance.
        </p>
      </div>
    </div>
  )
}
