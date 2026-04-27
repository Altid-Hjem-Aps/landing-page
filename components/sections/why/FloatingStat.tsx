type Props = {
  number: string
  label: string
  style?: React.CSSProperties
  className?: string
}

// Large dimmed numeral floating over the chaos pile. Reads as ambient
// stat texture — present when numbers are part of the chaos, fades when
// the resolution arrives.
export function FloatingStat({ number, label, style, className }: Props) {
  return (
    <div
      className={['pointer-events-none select-none', className].filter(Boolean).join(' ')}
      style={style}
    >
      <p
        className="font-extrabold leading-none tracking-tight"
        style={{
          fontSize: 'clamp(64px, 10vw, 140px)',
          color: 'rgba(46,125,82,0.32)',
          letterSpacing: '-0.04em',
        }}
      >
        {number}
      </p>
      <p
        className="text-[12px] font-bold tracking-[0.22em] uppercase mt-2"
        style={{ color: 'rgba(46,125,82,0.62)' }}
      >
        {label}
      </p>
    </div>
  )
}
