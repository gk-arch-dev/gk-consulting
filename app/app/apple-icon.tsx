import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1222',
          borderRadius: '36px',
        }}
      >
        <span
          style={{
            fontFamily: 'Geist',
            fontSize: 80,
            fontStyle: 'italic',
            color: '#b87333',
            letterSpacing: '-2px',
          }}
        >
          GK
        </span>
      </div>
    ),
    { ...size, fonts: [{ name: 'Geist', data: geist, style: 'normal' }] }
  )
}
