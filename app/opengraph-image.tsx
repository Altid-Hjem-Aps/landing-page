import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OG_IMAGE } from '@/lib/forside-copy'

// The share card for altidhjem.dk (and /app's link preview). Rendered at build
// time from files in the repo, so a deploy does not depend on a font service.
// If the font or the logo is missing the build fails, so a card in a fallback
// system font never ships.
//
// app/fonts/Onest-Medium.ttf is the static weight 500 instance of Onest that
// Google Fonts serves (OFL, see app/fonts/OFL.txt). ImageResponse reads ttf,
// otf and woff, not woff2, and renders a variable font at its default weight.

export const alt = OG_IMAGE.alt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [onest, logo] = await Promise.all([
    readFile(join(process.cwd(), 'app/fonts/Onest-Medium.ttf')),
    readFile(join(process.cwd(), 'public/altid-hjem-logo-white.svg')),
  ])
  const logoSrc = `data:image/svg+xml;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#163223',
          padding: '72px 80px',
          fontFamily: 'Onest',
        }}
      >
        <img src={logoSrc} alt="" width={151} height={80} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, color: '#FFFFFF', letterSpacing: '-0.02em', maxWidth: 720 }}>
            {OG_IMAGE.headline}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, color: 'rgba(255,255,255,0.8)', marginTop: 28 }}>
            {OG_IMAGE.subline}
          </div>
          <div style={{ fontSize: 26, color: '#90FF7C', marginTop: 40 }}>{OG_IMAGE.stores}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Onest', data: onest, style: 'normal', weight: 500 }],
    },
  )
}
