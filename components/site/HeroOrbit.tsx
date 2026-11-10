'use client'

import { useEffect, useRef } from 'react'
import { useMotionPiece } from './MotionPrefs'
import ServiceIcon, { type ServiceIconName } from './ServiceIcon'

// The four services circle the two hero phones on a tilted ellipse, each with a light trail
// as in the launch mail's header. On the near half an icon passes in front of the phones and
// grows; on the far half it passes behind them and shrinks, so the ring reads as 3D.
const ORBS: { name: ServiceIconName; tone: string }[] = [
  { name: 'okonomi', tone: '#ffd27a' },
  { name: 'mad', tone: '#bdb0f9' },
  { name: 'energi', tone: '#a3d5ff' },
  { name: 'forsikring', tone: '#ffbab8' },
]
const TURN_MS = 32000
const TILT = (-9 * Math.PI) / 180
const TRAIL = 0.62 // radians of ellipse behind each icon
const SEGMENTS = 28
// Where the ring sits, in design pixels of the hero's phone area (1440 wide; 390 on a phone).
const RING = {
  wide: { cx: 724, cy: 250, rx: 420, ry: 86, orb: 64 },
  phone: { cx: 186, cy: 170, rx: 160, ry: 38, orb: 44 },
}

export default function HeroOrbit() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const back = useRef<SVGSVGElement>(null)
  const front = useRef<SVGSVGElement>(null)
  const orbs = useRef<(HTMLDivElement | null)[]>([])
  const angle = useRef(0.35)

  useEffect(() => {
    const backSvg = back.current as SVGSVGElement
    const frontSvg = front.current as SVGSVGElement
    const draw = () => {
      const phone = window.innerWidth < 768
      const u = phone ? window.innerWidth / 390 : Math.min(window.innerWidth, 1440) / 1440
      const ring = phone ? RING.phone : RING.wide
      const cx = ring.cx * u
      const cy = ring.cy * u
      const rx = ring.rx * u
      const ry = ring.ry * u
      const at = (t: number) => ({
        x: cx + rx * Math.cos(t) * Math.cos(TILT) - ry * Math.sin(t) * Math.sin(TILT),
        y: cy + rx * Math.cos(t) * Math.sin(TILT) + ry * Math.sin(t) * Math.cos(TILT),
      })
      // The ring itself: a hairline, its far half behind the phones.
      const half = (from: number) => {
        const points = Array.from({ length: 33 }, (_, i) => at(from + (Math.PI * i) / 32))
        return 'M' + points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')
      }
      ;(backSvg.querySelector('.h-ring') as SVGPathElement).setAttribute('d', half(Math.PI))
      ;(frontSvg.querySelector('.h-ring') as SVGPathElement).setAttribute('d', half(0))
      ORBS.forEach((orb, i) => {
        const t = angle.current + (i * Math.PI) / 2
        const near = Math.sin(t)
        const p = at(t)
        const el = orbs.current[i] as HTMLDivElement
        const scale = 0.72 + 0.28 * ((near + 1) / 2)
        el.style.transform = `translate(${(p.x - (ring.orb * u) / 2).toFixed(1)}px, ${(p.y - (ring.orb * u) / 2).toFixed(1)}px) scale(${scale.toFixed(3)})`
        el.style.zIndex = near > 0 ? '3' : '0'
        // The trail: segments along the ring behind the icon, wider and stronger near it.
        for (let s = 0; s < SEGMENTS; s++) {
          const a = t - TRAIL + (TRAIL * s) / SEGMENTS
          const b = t - TRAIL + (TRAIL * (s + 1)) / SEGMENTS
          const p1 = at(a)
          const p2 = at(b)
          const k = (s + 1) / SEGMENTS
          const segNear = Math.sin((a + b) / 2) > 0
          const width = (ring.orb * u * 0.62 * k * (0.72 + 0.28 * ((Math.sin(b) + 1) / 2))).toFixed(1)
          const d = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)}L${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
          for (const [svg, mine] of [[frontSvg, segNear], [backSvg, !segNear]] as const) {
            const seg = svg.querySelector(`[data-seg="${i}-${s}"]`) as SVGPathElement
            seg.setAttribute('d', mine ? d : '')
            seg.setAttribute('stroke-width', width)
            seg.setAttribute('stroke-opacity', (k * k * 0.85).toFixed(2))
          }
        }
      })
    }
    draw()
    window.addEventListener('resize', draw)
    if (!running) return () => window.removeEventListener('resize', draw)
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      angle.current += ((now - last) / TURN_MS) * Math.PI * 2
      last = now
      draw()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', draw)
    }
  }, [running])

  const segments = (side: string) =>
    ORBS.map((orb, i) =>
      Array.from({ length: SEGMENTS }, (_, s) => (
        <path key={`${side}-${i}-${s}`} data-seg={`${i}-${s}`} stroke={orb.tone} strokeLinecap="butt" fill="none" />
      )),
    )

  return (
    <div ref={ref} className="h-orbit" data-running={running} aria-hidden="true">
      <svg ref={back} className="h-orbit-layer h-orbit-back">
        <path className="h-ring" />
        {segments('back')}
      </svg>
      <svg ref={front} className="h-orbit-layer h-orbit-front">
        <path className="h-ring" />
        {segments('front')}
      </svg>
      {ORBS.map((orb, i) => (
        <div
          key={orb.name}
          ref={(el) => {
            orbs.current[i] = el
          }}
          className="h-orb"
          style={{ background: orb.tone }}
        >
          <ServiceIcon name={orb.name} size={28} />
        </div>
      ))}
    </div>
  )
}
