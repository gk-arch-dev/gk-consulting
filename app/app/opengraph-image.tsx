import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'GK Consulting — Java & AWS Architect for European Companies'

export default function OgImage() {
  // Using Geist (bundled with Next.js) — no external fetch required at build time
  const geist = readFileSync(
    join(process.cwd(), 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0b1222',
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Blueprint grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(184,115,51,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,115,51,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* GK monogram */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0b1222',
              border: '1.5px solid #b87333',
              borderRadius: '8px',
            }}
          >
            <span
              style={{
                fontFamily: 'Geist',
                fontSize: 22,
                color: '#b87333',
                letterSpacing: '-1px',
              }}
            >
              GK
            </span>
          </div>
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 18,
              color: '#9aabb8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            GK Consulting
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 56,
              fontWeight: 700,
              color: '#f0ece2',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              maxWidth: '900px',
            }}
          >
            Java &amp; AWS Architect
          </span>
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 56,
              fontWeight: 700,
              color: '#b87333',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
            }}
          >
            for European Companies.
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '80px',
            right: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(184,115,51,0.3)',
            paddingTop: '24px',
          }}
        >
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 15,
              color: '#6b7d8e',
              letterSpacing: '0.04em',
            }}
          >
            AWS Solutions Architect Professional · Based in EU
          </span>
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 15,
              color: '#b87333',
              letterSpacing: '0.04em',
            }}
          >
            gk-consulting.eu
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Geist', data: geist, style: 'normal' }] }
  )
}
