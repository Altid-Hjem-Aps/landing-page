// The sample-data captions: staged screens and code-drawn numbers each have their
// own sentence. On a pastel or on Deep forest the Stone default loses contrast,
// so those sections pass their surface.

const TEXT = {
  screens: 'Skærmbilleder fra appen med eksempeldata.',
  illustration: 'Illustration med eksempeldata.',
}

const SURFACE = {
  cream: undefined,
  pastel: { color: 'var(--ah-deep-forest)' },
  forest: { color: 'rgb(255 255 255 / 0.72)' },
}

export default function Caption({
  kind = 'screens',
  on = 'cream',
  className = '',
}: {
  kind?: keyof typeof TEXT
  on?: keyof typeof SURFACE
  className?: string
}) {
  return (
    <p className={`ah-caption ${className}`} style={SURFACE[on]}>
      {TEXT[kind]}
    </p>
  )
}
