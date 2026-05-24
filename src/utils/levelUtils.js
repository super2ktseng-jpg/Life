export function expForLevel(n) {
  return Math.floor(100 * Math.pow(1.4, n - 1))
}

export function levelFromExp(totalExp) {
  let level = 1
  let accumulated = 0
  while (true) {
    const needed = expForLevel(level)
    if (accumulated + needed > totalExp) break
    accumulated += needed
    level++
  }
  return level
}

export function expAtLevelStart(level) {
  let total = 0
  for (let n = 1; n < level; n++) total += expForLevel(n)
  return total
}
