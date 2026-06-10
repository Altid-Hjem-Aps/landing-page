import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(() => {
  process.env.SURVEY_TOKEN_SECRET = 'test-secret'
})

describe('survey-token', () => {
  it('verifies a token it signed for the same id', async () => {
    const { signSurveyToken, verifySurveyToken } = await import('@/lib/survey-token')
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('abc123', token)).toBe(true)
  })

  it('rejects a token signed for a different id', async () => {
    const { signSurveyToken, verifySurveyToken } = await import('@/lib/survey-token')
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('other-id', token)).toBe(false)
  })

  it('rejects tampered and empty tokens without throwing', async () => {
    const { signSurveyToken, verifySurveyToken } = await import('@/lib/survey-token')
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('abc123', token.slice(0, -2) + 'xx')).toBe(false)
    expect(verifySurveyToken('abc123', '')).toBe(false)
    expect(verifySurveyToken('', token)).toBe(false)
  })
})
