import Caption from '@/components/site/primitives/Caption'
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
        <h2 className="vk-title">Velkommen hjem.</h2>
        <p className="vk-sub">Hent Altid Hjem gratis i dag.</p>
        {/* The one target of every "Hent appen" on this page. */}
        <div id={STORE_ANCHOR} className="vk-get">
          <StorePills position="final" variant="light" className="justify-center" />
          <QrCards />
        </div>
        <NewsletterForm variant="light" className="vk-form" />
        <Caption on="pastel" className="vk-caption" />
      </div>
      <VelkommenFan />
    </section>
  )
}
