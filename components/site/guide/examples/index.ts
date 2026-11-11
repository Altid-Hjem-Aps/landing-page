import ForsikringHusstand from './ForsikringHusstand'

// The animated illustrations a guide can show under the label "Eksempel". A data file names
// one by its key here; a new illustration is a new component and one line in this list.
export const EXAMPLES = {
  'forsikring-husstand': ForsikringHusstand,
} as const

export type ExampleId = keyof typeof EXAMPLES
