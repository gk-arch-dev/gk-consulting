import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import '@/styles/tokens.css'
import '@/styles/globals.css'
import '@/styles/utilities.css'
import '@/styles/components.css'
import '@/styles/sections.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const themeInitScript = `(function(){try{var t=localStorage.getItem('gk-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'
const DESCRIPTION =
  'Java & AWS architect helping European engineering leaders design, build, and modernize backend systems on AWS. Solutions Architect Professional. Based in EU.'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1020' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GK Consulting — Java & AWS Architect for European Companies',
    template: '%s · GK Consulting',
  },
  description: DESCRIPTION,
  authors: [{ name: 'Grzegorz Karolak' }],
  creator: 'Grzegorz Karolak',
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GK Consulting',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
