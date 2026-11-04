import StorePills from '@/components/site/primitives/StorePills'
import { STORE_ANCHOR } from '@/lib/store-links'

export default function Velkommen() {
  return (
    <section id="velkommen" className="ah-sec ah-bg-mint pb-[calc(clamp(72px,10vw,160px)+32px)]">
      <div className="ah-wrap flex flex-col items-center gap-6 text-center">
        <h2 className="ah-h1">Velkommen hjem.</h2>
        <p className="ah-body">Hent Altid Hjem gratis i dag.</p>
        {/* The one target of every "Hent appen" on this page. */}
        <div id={STORE_ANCHOR} className="scroll-mt-40">
          <StorePills position="final" className="justify-center" />
        </div>
      </div>
    </section>
  )
}
