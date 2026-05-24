export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function checkStreak(lastActiveDate, currentStreak, today) {
  if (!lastActiveDate) return { streak: 1, lastActiveDate: today }
  if (lastActiveDate === today) return { streak: currentStreak, lastActiveDate: today }
  const diffDays = Math.round(
    (new Date(today) - new Date(lastActiveDate)) / (1000 * 60 * 60 * 24)
  )
  return diffDays === 1
    ? { streak: currentStreak + 1, lastActiveDate: today }
    : { streak: 1, lastActiveDate: today }
}
