import Footer from '@/components/Footer'
import Hero from '@/components/site/Hero'
import Okonomi from '@/components/site/Okonomi'
import AltidMad from '@/components/site/AltidMad'
import Proof from '@/components/site/Proof'
import Spoergsmaal from '@/components/site/Spoergsmaal'
import Velkommen from '@/components/site/Velkommen'
import KeepJsClass from '@/components/site/primitives/KeepJsClass'
import PauseMotion from '@/components/site/primitives/PauseMotion'
import { getElpriser } from '@/lib/elpriser'

// Today's electricity prices in the Altid Energi tile stay at most half an hour old.
export const revalidate = 1800

export default async function Home() {
  const elpriser = await getElpriser()
  return (
    <div className="ah-site">
      <KeepJsClass />
      {/* Before the header, so it is the first stop for a keyboard. */}
      <a href="#indhold" className="ah-skip">
        Spring til indhold
      </a>
      <main id="indhold">
        <Hero />
        <Okonomi />
        <AltidMad />
        <Proof elpriser={elpriser} />
        <Spoergsmaal />
        <Velkommen />
      </main>
      <Footer sampleData front />
      <PauseMotion />
    </div>
  )
}
