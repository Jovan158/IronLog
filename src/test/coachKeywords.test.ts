import { describe, it, expect } from 'vitest'
import { COACH_KEYWORD_RESPONSES, COACH_DEFAULT_RESPONSE } from '../constants'

function getHardcodedResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const entry of COACH_KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response
    }
  }
  return COACH_DEFAULT_RESPONSE
}

describe('coach keyword matching', () => {
  it('responds to greetings', () => {
    const response = getHardcodedResponse('Hello there!')
    expect(response).toContain('AI Coach')
  })

  it('responds to motivation keywords', () => {
    const response = getHardcodedResponse('I feel so lazy today')
    expect(response).toContain('Discipline beats motivation')
  })

  it('responds to nutrition keywords', () => {
    const response = getHardcodedResponse('What should I eat?')
    expect(response).toContain('protein')
  })

  it('responds to sleep keywords', () => {
    const response = getHardcodedResponse("I'm so tired lately")
    expect(response).toContain('Sleep')
  })

  it('responds to soreness keywords', () => {
    const response = getHardcodedResponse('I have bad DOMS')
    expect(response).toContain('adapting')
  })

  it('responds to plateau keywords', () => {
    const response = getHardcodedResponse("I'm stuck and not progressing")
    expect(response).toContain('Plateaus')
  })

  it('responds to beginner keywords', () => {
    const response = getHardcodedResponse("I'm new to the gym")
    expect(response).toContain('compound movements')
  })

  it('responds to progressive overload keywords', () => {
    const response = getHardcodedResponse('Tell me about progressive overload')
    expect(response).toContain('Progressive overload')
  })

  it('responds to rest keywords', () => {
    const response = getHardcodedResponse('Should I take a rest day?')
    expect(response).toContain('Rest days')
  })

  it('responds to warmup keywords', () => {
    const response = getHardcodedResponse('How should I warm up?')
    expect(response).toContain('warm up')
  })

  it('responds to form keywords', () => {
    const response = getHardcodedResponse('How to do squats with proper form?')
    expect(response).toContain('form')
  })

  it('responds to weight loss keywords', () => {
    const response = getHardcodedResponse('I want to lose weight')
    expect(response).toContain('caloric deficit')
  })

  it('responds to bulk keywords', () => {
    const response = getHardcodedResponse('I want to bulk up and gain weight')
    expect(response).toContain('lean bulk')
  })

  it('returns default for unknown input', () => {
    const response = getHardcodedResponse('Tell me about quantum physics')
    expect(response).toBe(COACH_DEFAULT_RESPONSE)
  })
})
