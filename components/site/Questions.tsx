const QUESTIONS = [
  { text: 'Ikke mere “hvad skal vi spise?”', href: '#altid-mad', surface: 'ah-bg-lavender' },
  { text: '“Hvornår skal opvasken sættes over?”', href: '#altid-energi', surface: 'ah-bg-sky' },
  { text: 'Alle jeres forsikringer samlet ét sted', href: '#altid-forsikring', surface: 'ah-bg-rose' },
  { text: '“Bruger vi for meget på takeaway?”', href: '#okonomi', surface: 'ah-bg-honey' },
]

export default function Questions() {
  return (
    <section id="spoergsmaal-fra-hverdagen" className="ah-sec ah-bg-forest">
      <h2 className="sr-only">Fire spørgsmål fra hverdagen</h2>
      <ul className="ah-wrap grid gap-4 md:grid-cols-2">
        {QUESTIONS.map(({ text, href, surface }) => (
          <li key={href}>
            <a href={href} className={`ah-h3 block p-8 ${surface}`} style={{ borderRadius: 'var(--ah-radius-block)' }}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
