import { BANKS } from './copy'
import Marquee from './Marquee'

// Under the hero, as the reference's "works with" row: the Danish banks the app connects to,
// set as names in one quiet style, looping slowly.
const row = () =>
  BANKS.names.map((name) => (
    <li key={name} className="w-bank">
      {name}
    </li>
  ))

export default function WorksWith() {
  return (
    <section data-b="works" className="w">
      <h2 className="w-title">{BANKS.title}</h2>
      <Marquee label={BANKS.title} className="w-mq" first={row()} second={row()} />
    </section>
  )
}
