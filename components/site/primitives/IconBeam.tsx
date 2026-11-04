// A pastel service circle with a soft light beam trailing from it, as in the M0
// mail hero. The drift is a CSS loop (app/globals.css), stopped by the pause
// control and by reduced motion. Size: --ah-icon-size or a style/class setting it.

const ICONS = {
  madplan: { src: '/site/icons/madplan.svg', colour: '#bdb0f9' },
  strom: { src: '/site/icons/strom.svg', colour: '#a3d5ff' },
  forsikring: { src: '/site/icons/forsikring.svg', colour: '#ffbab8' },
  okonomi: { src: '/site/icons/okonomi.svg', colour: '#ffd27a' },
}

export default function IconBeam({
  icon,
  direction = 180,
  length = 2.6,
  delay = 0,
  className = '',
  style,
}: {
  icon: keyof typeof ICONS
  /** Where the beam points, in degrees: 0 right, 90 down, 180 left, 270 up. */
  direction?: number
  /** The beam's length in circle widths. */
  length?: number
  /** Seconds, negative to start mid-drift, so circles do not move in step. */
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const { src, colour } = ICONS[icon]
  const beam = {
    '--ah-beam-angle': `${direction}deg`,
    '--ah-beam-length': length,
    '--ah-beam-colour': colour,
  } as React.CSSProperties
  return (
    <span className={`ah-beam ${className}`} style={style} aria-hidden>
      <span className="ah-beam-drift" style={{ animationDelay: `${delay}s` }}>
        <span className="ah-beam-ray" style={beam} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ah-beam-icon" src={src} alt="" />
      </span>
    </span>
  )
}
