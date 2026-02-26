import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  kgToLbs,
  lbsToKg,
  calculateVolume,
  formatISODate,
  isSameDay,
  getWeekDates,
} from '../utils'

describe('formatDuration', () => {
  it('formats zero duration', () => {
    expect(formatDuration(1000, 1000)).toBe('00:00:00')
  })

  it('formats minutes and seconds', () => {
    const start = 0
    const end = 90 * 1000
    expect(formatDuration(start, end)).toBe('00:01:30')
  })

  it('formats hours', () => {
    const start = 0
    const end = 3661 * 1000
    expect(formatDuration(start, end)).toBe('01:01:01')
  })
})

describe('kgToLbs / lbsToKg', () => {
  it('converts kg to lbs', () => {
    expect(kgToLbs(100)).toBeCloseTo(220.5, 0)
  })

  it('converts lbs to kg', () => {
    expect(lbsToKg(220)).toBeCloseTo(99.8, 0)
  })
})

describe('calculateVolume', () => {
  it('calculates weight * reps * sets', () => {
    expect(calculateVolume(100, 10, 3)).toBe(3000)
  })
})

describe('formatISODate', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date('2024-03-15T10:30:00')
    expect(formatISODate(date)).toBe('2024-03-15')
  })
})

describe('isSameDay', () => {
  it('returns true for same date strings', () => {
    expect(isSameDay('2024-03-15', '2024-03-15')).toBe(true)
  })

  it('returns false for different dates', () => {
    expect(isSameDay('2024-03-15', '2024-03-16')).toBe(false)
  })
})

describe('getWeekDates', () => {
  it('returns 7 dates', () => {
    const dates = getWeekDates(new Date('2024-03-15'))
    expect(dates).toHaveLength(7)
  })

  it('starts on Monday', () => {
    const dates = getWeekDates(new Date('2024-03-15'))
    expect(dates[0].getDay()).toBe(1)
  })
})
