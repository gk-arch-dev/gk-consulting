import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog · GK Consulting',
  description: 'Long-form writing on Java, AWS, architecture, and engineering practice.',
}

export default function BlogPage() {
  return (
    <div style={{ paddingTop: '140px' }}>
      <div className="spine">
        <h1>Blog</h1>
        <p style={{ color: 'var(--ink-muted)', marginTop: '16px' }}>
          Step 05 will build this out.
        </p>
      </div>
    </div>
  )
}
