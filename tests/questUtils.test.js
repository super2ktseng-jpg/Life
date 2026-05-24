import { describe, it, expect } from 'vitest'
import { seededRandom, drawDailyQuests } from '../src/utils/questUtils'
import { QUEST_POOL } from '../src/data/questPool'

describe('seededRandom', () => {
  it('returns values in [0, 1)', () => {
    const r = seededRandom(42)
    const v = r()
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(1)
  })
  it('same seed → same sequence', () => {
    const a = seededRandom(99), b = seededRandom(99)
    expect(a()).toBe(b())
    expect(a()).toBe(b())
  })
  it('different seeds → different first value', () => {
    expect(seededRandom(1)()).not.toBe(seededRandom(2)())
  })
})

describe('drawDailyQuests', () => {
  it('returns exactly 2 quests', () => {
    expect(drawDailyQuests('2026-05-24', QUEST_POOL)).toHaveLength(2)
  })
  it('quests have id, title, reward, completed:false', () => {
    for (const q of drawDailyQuests('2026-05-24', QUEST_POOL)) {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('title')
      expect(q).toHaveProperty('reward')
      expect(q.completed).toBe(false)
    }
  })
  it('same date → same quests', () => {
    const a = drawDailyQuests('2026-05-24', QUEST_POOL)
    const b = drawDailyQuests('2026-05-24', QUEST_POOL)
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id))
  })
  it('different dates → different quests', () => {
    const a = drawDailyQuests('2026-05-24', QUEST_POOL)
    const b = drawDailyQuests('2026-05-25', QUEST_POOL)
    expect(a.map((q) => q.id)).not.toEqual(b.map((q) => q.id))
  })
})
