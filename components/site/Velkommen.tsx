import StorePills from '@/components/site/primitives/StorePills'
import JsonLd from '@/components/site/JsonLd'
import { VelkommenStage } from '@/components/site/VelkommenParts'
import { STORE_ANCHOR } from '@/lib/store-links'
import './velkommen.css'

export default function Velkommen() {
  return (
    <section id="velkommen" className="vk-wrap">
      <JsonLd />
      <div className="vk-sec">
        <div className="vk-grid" aria-hidden />
        {/* The one target of every "Hent appen" on this page. Holds the heading, so a
            jump lands on the whole scene, not on pills with no title. */}
        <div id={STORE_ANCHOR} className="vk-anchor">
          <h2 className="vk-title">
            <span>Velkommen hjem.</span> <span>Hent Altid Hjem gratis i dag.</span>
          </h2>
          <StorePills position="final" variant="solid" className="vk-pills" />
        </div>
        <VelkommenStage />
      </div>
    </section>
  )
}
