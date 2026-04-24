// Styled "Altid." catchphrase — used as a sentence-ending brand signature
// Brush stroke: wide/thick on the left, tapering to a thin point on the right

const stroke = (opacity: number) =>
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 20">` +
    `<path d="M 3,5 C 50,2 105,1 160,4 C 193,6 218,8 237,10 C 218,12 193,13 160,15 C 105,18 50,18 3,15 Z" fill="#a8e063" opacity="${opacity}"/>` +
    `</svg>`
  )

const LIGHT = stroke(0.68)
const DARK  = stroke(0.42)

export function AltidMark({ dark = false }: { dark?: boolean }) {
  return (
    <span style={{
      fontWeight: dark ? 700 : 800,
      color: dark ? 'var(--sage)' : 'var(--forest)',
      backgroundImage: `url("data:image/svg+xml,${dark ? DARK : LIGHT}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 100%',
      backgroundSize: '105% 0.48em',
      paddingBottom: '0.2em',
    }}>
      Altid.
    </span>
  )
}
