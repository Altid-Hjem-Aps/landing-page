import { BANKS } from './copy'
import Marquee from './Marquee'

// Under the hero, as the reference's "works with" row: the logos of Danish banks the app
// connects to, looping slowly. Square-ish logos get a little more height so they read as
// large as the long ones.
const row = (hidden: boolean) =>
  BANKS.logos.map((bank) => (
    <li key={bank.name} className="w-bank" data-tall={bank.ratio < 3.5 ? 'true' : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bank.src} alt={hidden ? '' : bank.name} style={{ aspectRatio: bank.ratio }} loading="lazy" />
    </li>
  ))

export default function WorksWith() {
  return (
    <section data-b="works" className="w">
      <h2 className="w-title">{BANKS.title}</h2>
      <Marquee label={BANKS.title} className="w-mq" first={row(false)} second={row(true)} />
    </section>
  )
}
