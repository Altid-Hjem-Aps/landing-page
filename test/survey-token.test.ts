import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { assertSurveyTokenConfigured, signSurveyToken, verifySurveyToken } from '@/lib/survey-token'

// lib/survey-token reads the secret lazily per call, so a static import + env
// stub is safe. stubEnv/unstubAllEnvs keeps the env clean for other test files.
beforeAll(() => {
  vi.stubEnv('SURVEY_TOKEN_SECRET', 'test-secret')
})

afterAll(() => {
  vi.unstubAllEnvs()
})

describe('survey-token', () => {
  it('verifies a token it signed for the same id', () => {
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('abc123', token)).toBe(true)
  })

  it('rejects a token signed for a different id', () => {
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('other-id', token)).toBe(false)
  })

  it('rejects tampered and empty tokens without throwing', () => {
    const token = signSurveyToken('abc123')
    expect(verifySurveyToken('abc123', token.slice(0, -2) + 'xx')).toBe(false)
    expect(verifySurveyToken('abc123', '')).toBe(false)
    expect(verifySurveyToken('', token)).toBe(false)
  })

  it('refuses to sign when no secret is configured (no empty-key HMAC)', () => {
    vi.stubEnv('SURVEY_TOKEN_SECRET', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    expect(() => signSurveyToken('abc123')).toThrow('survey-token')
    expect(() => assertSurveyTokenConfigured()).toThrow('survey-token')
    vi.stubEnv('SURVEY_TOKEN_SECRET', 'test-secret')
  })

  it('assertSurveyTokenConfigured passes when a secret is set', () => {
    expect(() => assertSurveyTokenConfigured()).not.toThrow()
  })
})
