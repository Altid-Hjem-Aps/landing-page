import { WORKS } from './copy'
import Marquee from './Marquee'
import ServiceIcon from './ServiceIcon'

// Centered small heading, then the row of services, each an anchor. On a computer it stands
// still and centered; on a phone (CSS) the same row loops.
const row = (hidden: boolean) =>
  WORKS.services.map((service) => (
    <li key={service.href}>
      {/* The loop's second copy still takes taps, but the tab key meets each service once. */}
      <a href={service.href} className="w-item" tabIndex={hidden ? -1 : undefined}>
        <ServiceIcon name={service.icon} />
        {service.name}
      </a>
    </li>
  ))

export default function WorksWith() {
  return (
    <section data-b="works" className="w">
      <h2 className="w-title">{WORKS.title}</h2>
      <Marquee label={WORKS.title} className="w-mq" first={row(false)} second={row(true)} />
    </section>
  )
}
