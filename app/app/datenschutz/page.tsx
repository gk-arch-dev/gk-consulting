import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz · GK Consulting',
  description: 'Privacy policy for GK Consulting.',
  robots: { index: false },
}

export default function DatenschutzPage() {
  return (
    <div style={{ paddingTop: '140px', paddingBottom: '80px' }}>
      <div className="spine">
        <h1>Datenschutz</h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: '24px', fontStyle: 'italic' }}>
          Imprint content to be added. Required for German legal compliance.
        </p>
      </div>
    </div>
  )
}
