import StorePills from '@/components/site/primitives/StorePills'
import JsonLd from '@/components/site/JsonLd'
import { QrCards, VelkommenFan } from '@/components/site/VelkommenParts'
import NewsletterForm from '@/components/NewsletterForm'
import { STORE_ANCHOR } from '@/lib/store-links'
import './velkommen.css'

export default function Velkommen() {
  return (
    <section id="velkommen" className="vk-sec">
      <JsonLd />
      <div className="vk-head">
        {/* The one target of every "Hent appen" on this page. Holds the heading, so a
            jump lands on the whole scene, not on pills with no title. */}
        <div id={STORE_ANCHOR} className="vk-anchor">
          <h2 className="vk-title">Velkommen hjem.</h2>
          <p className="vk-sub">Hent Altid Hjem gratis i dag.</p>
          <div className="vk-get">
            <StorePills position="final" variant="light" className="justify-center ah-pills-large" />
            <QrCards />
          </div>
        </div>
        <NewsletterForm variant="light" className="vk-form" />
      </div>
      <VelkommenFan />
    </section>
  )
}
