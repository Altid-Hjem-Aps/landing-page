import { REASSURANCE } from '@/lib/forside-copy'

export default function Reassurance() {
  return (
    <section id="tryghed" aria-labelledby="tryghed-title" className="bg-[var(--app-beige)] py-14 lg:py-20">
      <h2 id="tryghed-title" className="sr-only">
        {REASSURANCE.title}
      </h2>
      <ul className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-6 lg:grid-cols-3 lg:gap-12 lg:px-12">
        {REASSURANCE.items.map((item) => (
          <li key={item} className="flex gap-3 text-[17px] leading-[1.55] text-[var(--app-forest)]">
            <span aria-hidden className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-[var(--app-forest)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
