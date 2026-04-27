import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getAllCaseStudies, getCaseStudy } from '@/lib/content'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllCaseStudies().map((c) => ({ slug: c.slug }))
}
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateAltText({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  return cs?.title ?? 'GK Consulting Case Study'
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)

  const title = cs?.title ?? 'Case Study'
  const metric = cs?.outcomeMetric ?? ''
  const metricLabel = cs?.outcomeLabel ?? ''
  const industry = cs?.industry ?? ''

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
          background: '#0b1222',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* Blueprint grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(184,115,51,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184,115,51,0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Eyebrow */}
        <span
          style={{
            fontFamily: 'Geist',
            fontSize: 13,
            color: '#b87333',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Case Study{industry ? ` · ${industry}` : ''}
        </span>

        {/* Title */}
        <span
          style={{
            fontFamily: 'Geist',
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 700,
            color: '#f0ece2',
            lineHeight: 1.2,
            letterSpacing: '-1px',
            maxWidth: '800px',
            flex: 1,
          }}
        >
          {title}
        </span>

        {/* Outcome metric */}
        {metric && (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              marginTop: '24px',
              paddingLeft: '20px',
              borderLeft: '3px solid #b87333',
            }}
          >
            <span
              style={{
                fontFamily: 'Geist',
                fontSize: 48,
                fontWeight: 700,
                color: '#b87333',
                letterSpacing: '-1px',
              }}
            >
              {metric}
            </span>
            {metricLabel && (
              <span style={{ fontFamily: 'Geist', fontSize: 20, color: '#9aabb8' }}>
                {metricLabel}
              </span>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(184,115,51,0.25)',
            paddingTop: '20px',
            marginTop: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #b87333',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontFamily: 'Geist', fontSize: 14, color: '#b87333' }}>GK</span>
            </div>
            <span style={{ fontFamily: 'Geist', fontSize: 15, color: '#6b7d8e' }}>
              GK Consulting
            </span>
          </div>
          <span style={{ fontFamily: 'Geist', fontSize: 15, color: '#6b7d8e' }}>
            gk-consulting.eu
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Geist', data: geist, style: 'normal' }] }
  )
}
