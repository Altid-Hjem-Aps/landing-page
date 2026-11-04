import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Hero from '@/components/site/Hero'
import Questions from '@/components/site/Questions'
import Okonomi from '@/components/site/Okonomi'
import AltidMad from '@/components/site/AltidMad'
import AltidEnergi from '@/components/site/AltidEnergi'
import AltidForsikring from '@/components/site/AltidForsikring'
import Proof from '@/components/site/Proof'
import Spoergsmaal from '@/components/site/Spoergsmaal'
import Velkommen from '@/components/site/Velkommen'
import KeepJsClass from '@/components/site/primitives/KeepJsClass'
import { getElpriser } from '@/lib/elpriser'

// Today's electricity prices in the Altid Energi section stay at most half an hour old.
export const revalidate = 1800

export default async function Home() {
  const elpriser = await getElpriser()
  return (
    <div className="ah-site">
      <KeepJsClass />
      {/* Before the nav, so it is the first stop for a keyboard. */}
      <a href="#indhold" className="ah-skip">
        Spring til indhold
      </a>
      <Nav motionControl />
      <main id="indhold">
        <Hero />
        <Questions />
        <Okonomi />
        <AltidMad />
        <AltidEnergi elpriser={elpriser} />
        <AltidForsikring />
        <Proof />
        <Spoergsmaal />
        <Velkommen />
      </main>
      <Footer sampleData />
    </div>
  )
}
