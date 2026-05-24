export function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0x100000000
  }
}

function dateSeed(dateStr) {
  return dateStr.replace(/-/g, '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function drawDailyQuests(dateStr, pool) {
  const rand = seededRandom(dateSeed(dateStr))
  const shuffled = [...pool].sort(() => rand() - 0.5)
  return shuffled.slice(0, 2).map((q) => ({ ...q, completed: false }))
}
