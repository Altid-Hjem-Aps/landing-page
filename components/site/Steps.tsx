import StoreBadges from '@/components/StoreBadges'
import { STEPS } from './copy'

// The four steps from the old front page (components/sections/HowItWorks.tsx), told as the
// app works today, as solid store-colour cards.
export default function Steps() {
  return (
    <section data-b="steps" className="sec st" aria-labelledby="st-title">
      <p className="st-eyebrow">{STEPS.eyebrow}</p>
      <h2 id="st-title" className="t-h2 st-title">
        {STEPS.title}
      </h2>
      <ol className="st-list">
        {STEPS.steps.map((step) => (
          <li key={step.n} className="st-card" data-tone={step.tone}>
            <span className="st-n" aria-hidden="true">
              {step.n}
            </span>
            <h3 className="st-card-title">{step.title}</h3>
            <p className="st-card-body">{step.body}</p>
          </li>
        ))}
      </ol>
      <StoreBadges position="how-it-works" variant="cream" size="lg" className="st-pills justify-center" />
    </section>
  )
}
