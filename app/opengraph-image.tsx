import { ImageResponse } from 'next/og'

// Open Graph card shown when an altidhjem.dk link is shared (Facebook,
// LinkedIn, the native share sheet, etc.). Generated at build/request time and
// cached, so there is no static asset to maintain. Uses the real white logo
// and the Onest brand font.
export const alt = 'Altid Hjem — bedre råd til hjemmet'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const [logoSvg, onest400, onest600] = await Promise.all([
    fetch('https://www.altidhjem.dk/altid-hjem-logo-white.svg').then((r) => r.text()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/onest/files/onest-latin-400-normal.woff').then((r) =>
      r.arrayBuffer(),
    ),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/onest/files/onest-latin-600-normal.woff').then((r) =>
      r.arrayBuffer(),
    ),
  ])
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#163223',
          padding: '90px',
          fontFamily: 'Onest',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={360} height={191} alt="Altid Hjem" style={{ display: 'block' }} />
        <div
          style={{
            display: 'flex',
            fontSize: 46,
            fontWeight: 500,
            color: '#fdfaf4',
            lineHeight: 1.35,
            marginTop: 56,
          }}
        >
          Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning. Altid.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Onest', data: onest400, weight: 400, style: 'normal' },
        { name: 'Onest', data: onest600, weight: 600, style: 'normal' },
      ],
    },
  )
}
