import { describe, it, expect } from 'vitest'
import { expForLevel, levelFromExp, expAtLevelStart } from '../src/utils/levelUtils'

describe('expForLevel', () => {
  it('level 1 requires 100 EXP', () => expect(expForLevel(1)).toBe(100))
  it('level 2 requires 140 EXP', () => expect(expForLevel(2)).toBe(140))
  it('threshold grows each level', () => expect(expForLevel(3)).toBeGreaterThan(expForLevel(2)))
})

describe('levelFromExp', () => {
  it('0 EXP = level 1',   () => expect(levelFromExp(0)).toBe(1))
  it('99 EXP = level 1',  () => expect(levelFromExp(99)).toBe(1))
  it('100 EXP = level 2', () => expect(levelFromExp(100)).toBe(2))
  it('240 EXP = level 3', () => expect(levelFromExp(240)).toBe(3))
})

describe('expAtLevelStart', () => {
  it('level 1 starts at 0',   () => expect(expAtLevelStart(1)).toBe(0))
  it('level 2 starts at 100', () => expect(expAtLevelStart(2)).toBe(100))
  it('level 3 starts at 240', () => expect(expAtLevelStart(3)).toBe(240))
})
