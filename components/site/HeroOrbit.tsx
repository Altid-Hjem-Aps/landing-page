'use client'

import { useEffect, useRef } from 'react'
import { useMotionPiece } from './MotionPrefs'
import ServiceIcon, { type ServiceIconName } from './ServiceIcon'

// The four services circle the two hero phones on a tilted ellipse (not drawn), each with a
// light trail as in the launch mail's header. On the near half an icon passes in front of the phones and
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
const SAMPLES = 32
// Where the ring sits, in design pixels (1440 wide; 390 on a phone), measured from the middle
// of the hero's phone area so it stays centred on the two phones at any window width.
const RING = {
  wide: { dx: 30, cy: 360, rx: 430, ry: 90, orb: 64 },
  phone: { dx: 6, cy: 262, rx: 168, ry: 40, orb: 44 },
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
    const host = ref.current as HTMLDivElement
    const draw = () => {
      const phone = window.innerWidth < 768
      const u = phone ? window.innerWidth / 390 : Math.min(window.innerWidth, 1440) / 1440
      const ring = phone ? RING.phone : RING.wide
      const cx = host.clientWidth / 2 + ring.dx * u
      const cy = ring.cy * u
      const rx = ring.rx * u
      const ry = ring.ry * u
      const at = (t: number) => ({
        x: cx + rx * Math.cos(t) * Math.cos(TILT) - ry * Math.sin(t) * Math.sin(TILT),
        y: cy + rx * Math.cos(t) * Math.sin(TILT) + ry * Math.sin(t) * Math.cos(TILT),
      })
      ORBS.forEach((orb, i) => {
        const t = angle.current + (i * Math.PI) / 2
        const near = Math.sin(t)
        const p = at(t)
        const el = orbs.current[i] as HTMLDivElement
        const scale = 0.72 + 0.28 * ((near + 1) / 2)
        el.style.transform = `translate(${(p.x - (ring.orb * u) / 2).toFixed(1)}px, ${(p.y - (ring.orb * u) / 2).toFixed(1)}px) scale(${scale.toFixed(3)})`
        el.style.zIndex = near > 0 ? '3' : '0'
        // The trail: one ribbon along the ring behind the icon, widening towards it, filled
        // with a gradient from nothing at the tail to the icon's colour at its head. Where it
        // crosses from the near half to the far half it is split between the two layers.
        const left: { x: number; y: number }[] = []
        const right: { x: number; y: number }[] = []
        const nearAt: boolean[] = []
        for (let s = 0; s <= SAMPLES; s++) {
          const k = s / SAMPLES
          const a = t - TRAIL + TRAIL * k
          const c = at(a)
          const d = at(a + 0.001)
          const len = Math.hypot(d.x - c.x, d.y - c.y) || 1
          const nx = -(d.y - c.y) / len
          const ny = (d.x - c.x) / len
          const half = ring.orb * u * 0.31 * k * (0.72 + 0.28 * ((Math.sin(a) + 1) / 2))
          left.push({ x: c.x + nx * half, y: c.y + ny * half })
          right.push({ x: c.x - nx * half, y: c.y - ny * half })
          nearAt.push(Math.sin(a) > 0)
        }
        const ribbon = (from: number, to: number) => {
          const pts = [...left.slice(from, to + 1), ...right.slice(from, to + 1).reverse()]
          return 'M' + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('L') + 'Z'
        }
        const paths = { front: '', back: '' }
        let start = 0
        for (let s = 1; s <= SAMPLES + 1; s++) {
          if (s === SAMPLES + 1 || nearAt[s] !== nearAt[start]) {
            const side = nearAt[start] ? 'front' : 'back'
            paths[side] += ribbon(start, Math.min(s, SAMPLES))
            start = s
          }
        }
        const tail = at(t - TRAIL)
        for (const [svg, side] of [
          [frontSvg, 'front'],
          [backSvg, 'back'],
        ] as const) {
          ;(svg.querySelector(`[data-trail="${i}"]`) as SVGPathElement).setAttribute('d', paths[side])
          const g = svg.querySelector(`[data-grad="${i}"]`) as SVGLinearGradientElement
          g.setAttribute('x1', tail.x.toFixed(1))
          g.setAttribute('y1', tail.y.toFixed(1))
          g.setAttribute('x2', p.x.toFixed(1))
          g.setAttribute('y2', p.y.toFixed(1))
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

  const trails = (side: string) =>
    ORBS.map((orb, i) => (
      <g key={`${side}-${i}`}>
        <defs>
          <linearGradient id={`h-trail-${side}-${i}`} data-grad={i} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={orb.tone} stopOpacity="0" />
            <stop offset="1" stopColor={orb.tone} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path data-trail={i} fill={`url(#h-trail-${side}-${i})`} />
      </g>
    ))

  return (
    <div ref={ref} className="h-orbit" data-running={running} aria-hidden="true">
      <svg ref={back} className="h-orbit-layer h-orbit-back">
        {trails('back')}
      </svg>
      <svg ref={front} className="h-orbit-layer h-orbit-front">
        {trails('front')}
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
