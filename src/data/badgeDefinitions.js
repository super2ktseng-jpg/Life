export const BADGE_DEFINITIONS = [
  {
    id: 'health-hero',
    name: '健康達人', emoji: '💪',
    description: '累計記錄 10 件健康事項',
    check: (state) => state.entries.filter((e) => e.category === 'health').length >= 10,
  },
  {
    id: 'study-star',
    name: '學習之星', emoji: '📖',
    description: '累計記錄 10 件學習事項',
    check: (state) => state.entries.filter((e) => e.category === 'learning').length >= 10,
  },
  {
    id: 'streak-7',
    name: '7天連續', emoji: '🔥',
    description: '連續登入 7 天',
    check: (state) => state.profile.streak >= 7,
  },
  {
    id: 'champion',
    name: '冠軍', emoji: '🏆',
    description: '達到等級 20',
    check: (state) => state.profile.level >= 20,
  },
  {
    id: 'lightning',
    name: '閃電', emoji: '⚡',
    description: '單日記錄 5 件事',
    check: (state) => {
      const today = new Date().toISOString().slice(0, 10)
      return state.entries.filter((e) => e.date === today).length >= 5
    },
  },
  {
    id: 'allstar',
    name: '全明星', emoji: '🌟',
    description: '解鎖所有其他徽章',
    check: (state) =>
      ['health-hero', 'study-star', 'streak-7', 'champion', 'lightning'].every(
        (id) => state.badges.find((b) => b.id === id)?.unlockedAt != null
      ),
  },
]
