// Styled "Altid." catchphrase — used as a sentence-ending brand signature
export function AltidMark({ dark = false }: { dark?: boolean }) {
  if (dark) {
    return (
      <span style={{
        fontWeight: 700,
        color: 'var(--sage)',
        textDecoration: 'underline',
        textDecorationColor: 'var(--sage)',
        textDecorationThickness: 2,
        textUnderlineOffset: 4,
      }}>Altid.</span>
    )
  }
  return (
    <span style={{
      color: 'var(--forest)',
      fontWeight: 800,
      textDecoration: 'underline',
      textDecorationColor: 'var(--sage)',
      textDecorationThickness: 2,
      textUnderlineOffset: 4,
    }}>
      Altid.
    </span>
  )
}
