import { BANKS } from './copy'
import Marquee from './Marquee'

// The logos of the Danish banks the app connects to, looping slowly. Square-ish logos get a
// little more height so they read as large as the long ones. Sits inside the privacy panel.
const row = (hidden: boolean) =>
  BANKS.logos.map((bank) => (
    <li key={bank.name} className="w-bank" data-tall={bank.ratio < 3.5 ? 'true' : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bank.src} alt={hidden ? '' : bank.name} style={{ aspectRatio: bank.ratio }} loading="lazy" />
    </li>
  ))

export default function BankMarquee() {
  return (
    <div className="w">
      <p className="w-title">{BANKS.title}</p>
      <Marquee label={BANKS.title} className="w-mq" first={row(false)} second={row(true)} />
    </div>
  )
}
