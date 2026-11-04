import Phone from '@/components/site/primitives/Phone'
import StorePills from '@/components/site/primitives/StorePills'
import Caption from '@/components/site/primitives/Caption'
import { SCREENS } from '@/components/site/screens'

export default function Hero() {
  return (
    <section id="top" className="ah-sec ah-bg-forest overflow-clip">
      <div className="ah-wrap flex flex-col items-center gap-10 pt-16 text-center">
        <h1 className="ah-h1">Hele hjemmet i én app</h1>
        <p className="ah-body max-w-[560px]">
          Få overblik over jeres mad, strøm, forsikring og økonomi. Hent Altid Hjem gratis i dag.
        </p>
        <StorePills position="hero" variant="dark" className="justify-center" />
        <p className="ah-body">Kan kun læse. Aldrig flytte penge.</p>
        <Phone
          screen={SCREENS.hjemTop}
          preload
          sizes="(max-width: 767px) 80vw, 360px"
          style={{ '--ah-phone-w': 'clamp(260px, 26vw, 360px)' } as React.CSSProperties}
        />
        <h2 className="ah-h2">Ét overblik. Ét login. Hele hjemmet.</h2>
        <Caption on="forest" />
      </div>
    </section>
  )
}
