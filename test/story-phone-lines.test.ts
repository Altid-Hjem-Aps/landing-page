import { describe, expect, it } from 'vitest'
import { STORY } from '@/components/site/copy'

// The story's phone text is the computer's text with Thor's line breaks: the words must stay
// the same when either one is edited.
const words = (text: string) => text.replace(/\s+/g, ' ').trim()

describe('story phone lines', () => {
  it('keeps the same words as the computer text', () => {
    expect(words(STORY.phone.title)).toBe(words(STORY.title))
    expect(words(STORY.phone.quote)).toBe(words(STORY.quote))
    expect(words(STORY.phone.body)).toBe(words(STORY.body))
  })
})
