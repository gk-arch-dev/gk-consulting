import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-signature">
        <div className="footer-wordmark">
          GK <em>Consulting</em>
        </div>
        <div className="footer-wordmark-sub">
          Java &amp; AWS Architecture
          <br />
          Based in EU · Working across Europe
        </div>
      </div>
      <div className="footer-inner">
        <div className="footer-left">
          © {year} GK Consulting · Grzegorz Karolak
        </div>
        <div className="footer-meta">
          Built with Next.js on AWS
          <span className="footer-meta-mark">· EU-hosted</span>
        </div>
        <div className="footer-links">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </footer>
  )
}
