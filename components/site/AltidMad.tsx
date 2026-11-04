export default function AltidMad() {
  return (
    <section id="altid-mad" className="ah-sec ah-bg-lavender">
      <div className="ah-wrap">
        <h2 className="ah-h2 max-w-[16ch]">Ikke mere “hvad skal vi spise?”</h2>
        <p className="ah-num mt-10 text-[clamp(64px,14vw,200px)]">
          11.207 <span className="ah-unit">kr.</span>
        </p>
        <p className="ah-h3 mt-6">Spar 11.207 kr. om året på dagligvarer*</p>
        <p className="ah-body mt-3 max-w-[640px]">
          *Altid Mad Q3-rapporten viser, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 % mindre
          i den billigste kæde end i den midterste af 13 kæder.{' '}
          <a href="https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf" className="underline underline-offset-2">
            Læs rapporten
          </a>
        </p>
        <p className="ah-h3 ah-hang mt-12">“Hvor handler vi billigst ind?”</p>
      </div>
    </section>
  )
}
