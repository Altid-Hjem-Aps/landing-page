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
          fontSize: 'clamp(56px, 9vw, 120px)',
          color: 'rgba(46,125,82,0.18)',
          letterSpacing: '-0.04em',
        }}
      >
        {number}
      </p>
      <p
        className="text-[11px] font-semibold tracking-[0.18em] uppercase mt-2"
        style={{ color: 'rgba(46,125,82,0.42)' }}
      >
        {label}
      </p>
    </div>
  )
}
