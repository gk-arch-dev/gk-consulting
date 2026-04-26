import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        padding: '32px',
      }}
    >
      <ThemeToggle />

      <h1>
        Design system <em>check</em>
      </h1>

      <p style={{ color: 'var(--ink-muted)', maxWidth: '480px', textAlign: 'center' }}>
        Body text in Inter. The heading above is Instrument Serif with a copper italic accent.
      </p>

      <p className="mono" style={{ fontSize: '13px', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
        JetBrains Mono — labels, tags, dates, code
      </p>

      <button
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '13px',
          letterSpacing: '0.04em',
          padding: '14px 24px',
          borderRadius: '999px',
          border: '2px solid var(--accent)',
          background: 'transparent',
          color: 'var(--accent)',
          cursor: 'pointer',
        }}
      >
        copper_border_button
      </button>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['--bg', '--bg-elev', '--accent', '--ink', '--border'].map((token) => (
          <div
            key={token}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '8px',
              background: `var(${token})`,
              border: '1px solid var(--border-strong)',
            }}
            title={token}
          />
        ))}
      </div>
    </div>
  )
}
