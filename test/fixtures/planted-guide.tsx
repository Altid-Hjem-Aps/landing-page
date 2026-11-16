import Guide, { GuideFigure } from '@/components/site/Guide'

/** A guide that exists only in test/guide-checks.test.tsx: it plants an article of chosen parts, so
 * the test can prove the new-guide checks fail on a short or long article, statement headings or
 * text outside a <section>, without touching a real page. Each part is a <section> or a <div>
 * with its headings as h2s and a paragraph of `words` words; the first part also holds a figure
 * with a 500-word caption, which the count leaves out. */
export default function PlantedGuide({ published, parts }: { published: string; parts: { tag: 'section' | 'div'; headings: string[]; words: number }[] }) {
  return (
    <Guide
      title="Hvad koster en plantet guide?"
      lead={<p>En guide til testen.</p>}
      meta="Kilde: testen"
      answer={{ label: 'Svar', value: '1' }}
      faq={[{ q: 'Hvad koster en plantet guide?', a: ['Intet.'] }]}
      cta={{ eyebrow: 'Test', heading: 'Test', subtitle: 'Test' }}
      page={{ path: '/plantet-guide', description: 'En guide til testen.', published, updated: published }}
    >
      {parts.map(({ tag: Tag, headings, words }, i) => (
        <Tag key={headings.join()}>
          {headings.map((heading) => (
            <h2 key={heading}>{heading}</h2>
          ))}
          <p>{Array.from({ length: words }, () => 'ord').join(' ')}</p>
          {i === 0 ? (
            <GuideFigure caption={`Eksempel: ${Array.from({ length: 500 }, () => 'billedtekst').join(' ')}. Illustration, ikke et skærmbillede fra appen.`}>
              <p>Tegning</p>
            </GuideFigure>
          ) : null}
        </Tag>
      ))}
    </Guide>
  )
}
