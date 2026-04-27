import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getAllBlogPosts, getBlogPost, TAG_DISPLAY } from '@/lib/content'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }))
}
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateAltText({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  return post?.title ?? 'GK Consulting Blog'
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  const title = post?.title ?? 'GK Consulting Blog'
  const thesis = post?.thesis ?? ''
  const tagLabel = post?.tags[0] ? (TAG_DISPLAY[post.tags[0]] ?? post.tags[0]) : ''
  const readTime = post?.readTime ?? ''

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

        {/* Tag label */}
        {tagLabel && (
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
            {tagLabel}
          </span>
        )}

        {/* Title */}
        <span
          style={{
            fontFamily: 'Geist',
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 700,
            color: '#f0ece2',
            lineHeight: 1.2,
            letterSpacing: '-1px',
            maxWidth: '960px',
            flex: 1,
          }}
        >
          {title}
        </span>

        {/* Thesis */}
        {thesis && (
          <span
            style={{
              fontFamily: 'Geist',
              fontSize: 20,
              color: '#9aabb8',
              lineHeight: 1.5,
              maxWidth: '800px',
              marginTop: '20px',
            }}
          >
            {thesis.length > 120 ? thesis.slice(0, 117) + '…' : thesis}
          </span>
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
              Grzegorz Karolak · GK Consulting
            </span>
          </div>
          <span style={{ fontFamily: 'Geist', fontSize: 15, color: '#6b7d8e' }}>
            {readTime} read
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Geist', data: geist, style: 'normal' }] }
  )
}
