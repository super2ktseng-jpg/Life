import { describe, it, expect } from 'vitest'
import { todayStr, checkStreak } from '../src/utils/dateUtils'

describe('todayStr', () => {
  it('returns YYYY-MM-DD format', () => expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/))
})

describe('checkStreak', () => {
  it('streak 1 when no previous date', () => {
    expect(checkStreak(null, 0, '2026-05-24')).toEqual({ streak: 1, lastActiveDate: '2026-05-24' })
  })
  it('increments on consecutive day', () => {
    expect(checkStreak('2026-05-23', 5, '2026-05-24')).toEqual({ streak: 6, lastActiveDate: '2026-05-24' })
  })
  it('unchanged on same day', () => {
    expect(checkStreak('2026-05-24', 5, '2026-05-24')).toEqual({ streak: 5, lastActiveDate: '2026-05-24' })
  })
  it('resets to 1 after gap', () => {
    expect(checkStreak('2026-05-20', 5, '2026-05-24')).toEqual({ streak: 1, lastActiveDate: '2026-05-24' })
  })
})
