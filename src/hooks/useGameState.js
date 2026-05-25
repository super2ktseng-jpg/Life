import { useState, useEffect, useRef } from 'react'
import { loadState, saveState } from '../utils/storageUtils'
import { todayStr, checkStreak } from '../utils/dateUtils'
import { levelFromExp } from '../utils/levelUtils'
import { drawDailyQuests } from '../utils/questUtils'
import { BADGE_DEFINITIONS } from '../data/badgeDefinitions'
import { ITEM_DEFINITIONS } from '../data/itemDefinitions'
import { QUEST_POOL } from '../data/questPool'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FIXED_DAILY_QUESTS = [
  { id: 'daily-login',  title: '今日登入',        reward: 10 },
  { id: 'daily-health', title: '完成一件健康事項', reward: 30 },
  { id: 'daily-three',  title: '記錄任意 3 件事',  reward: 20 },
]

const buildInitialState = () => {
  const today = todayStr()
  return {
    profile: { name: 'Hero', level: 1, exp: 0, streak: 1, lastActiveDate: today },
    entries: [],
    badges: BADGE_DEFINITIONS.map(b => ({ id: b.id, unlockedAt: null })),
    inventory: ITEM_DEFINITIONS.map(i => ({ id: i.id, unlockedAt: null })),
    quests: {
      daily: FIXED_DAILY_QUESTS.map(q => ({ ...q, completed: false })),
      random: drawDailyQuests(today, QUEST_POOL),
      lastRefreshed: today,
    },
  }
}

// ---------------------------------------------------------------------------
// Pure helpers (no React inside)
// ---------------------------------------------------------------------------

function checkBadgeUnlocks(newState) {
  const now = new Date().toISOString()
  const newlyUnlocked = []
  const updatedBadges = newState.badges.map(b => {
    if (b.unlockedAt) return b
    const def = BADGE_DEFINITIONS.find(d => d.id === b.id)
    if (def && def.check(newState)) {
      newlyUnlocked.push(b.id)
      return { ...b, unlockedAt: now }
    }
    return b
  })
  return { updatedBadges, newlyUnlocked }
}

function checkItemUnlocks(inventory, newLevel) {
  const now = new Date().toISOString()
  return inventory.map(item => {
    if (item.unlockedAt) return item
    const def = ITEM_DEFINITIONS.find(d => d.id === item.id)
    if (def && newLevel >= def.unlockLevel) {
      return { ...item, unlockedAt: now }
    }
    return item
  })
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameState() {
  const [state, setState] = useState(null)
  const [levelUpInfo, setLevelUpInfo] = useState(null)
  const [newBadges, setNewBadges] = useState([])

  // Track whether initial mount logic has run (prevents double-fire in StrictMode)
  const initialised = useRef(false)

  // -------------------------------------------------------------------------
  // Mount: load → streak → quest refresh → daily-login auto-complete → save
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    const today = todayStr()
    let s = loadState() ?? buildInitialState()

    // Reconcile badges: add any new badge definitions missing from stored state
    s = {
      ...s,
      badges: BADGE_DEFINITIONS.map(def => {
        const existing = s.badges.find(b => b.id === def.id)
        return existing ?? { id: def.id, unlockedAt: null }
      }),
      inventory: ITEM_DEFINITIONS.map(def => {
        const existing = s.inventory.find(i => i.id === def.id)
        return existing ?? { id: def.id, unlockedAt: null }
      }),
    }

    // 1. Streak check
    const streakResult = checkStreak(s.profile.lastActiveDate, s.profile.streak, today)
    s = {
      ...s,
      profile: { ...s.profile, streak: streakResult.streak, lastActiveDate: streakResult.lastActiveDate },
    }

    // 2. Quest refresh
    if (s.quests.lastRefreshed !== today) {
      s = {
        ...s,
        quests: {
          daily: FIXED_DAILY_QUESTS.map(q => ({ ...q, completed: false })),
          random: drawDailyQuests(today, QUEST_POOL),
          lastRefreshed: today,
        },
      }
    }

    // 3. Auto-complete daily-login quest
    const loginQuest = s.quests.daily.find(q => q.id === 'daily-login')
    let loginReward = 0
    let updatedDaily = s.quests.daily
    if (loginQuest && !loginQuest.completed) {
      loginReward = loginQuest.reward
      updatedDaily = s.quests.daily.map(q =>
        q.id === 'daily-login' ? { ...q, completed: true } : q
      )
    }

    // Apply login reward
    const newExp = s.profile.exp + loginReward
    const newLevel = levelFromExp(newExp)
    const prevLevel = s.profile.level

    s = {
      ...s,
      profile: { ...s.profile, exp: newExp, level: newLevel },
      quests: { ...s.quests, daily: updatedDaily },
    }

    // 4. Badge & item unlocks after login reward
    const { updatedBadges, newlyUnlocked } = checkBadgeUnlocks(s)
    const updatedInventory = checkItemUnlocks(s.inventory, newLevel)
    s = { ...s, badges: updatedBadges, inventory: updatedInventory }

    // 5. Level-up notification (only if level actually increased on this mount)
    if (newLevel > prevLevel) {
      setLevelUpInfo({ level: newLevel })
    }
    if (newlyUnlocked.length > 0) {
      setNewBadges(prev => [...prev, ...newlyUnlocked])
    }

    saveState(s)
    setState(s)
  }, [])

  // -------------------------------------------------------------------------
  // addEntry
  // -------------------------------------------------------------------------
  const addEntry = (title, category, points, description = '', link = '', date = null) => {
    let capturedLevelUp = null
    let capturedBadges = []

    setState(prev => {
      if (!prev) return prev
      const today = todayStr()
      const entryDate = date ?? today

      // 1. New entry
      const newEntry = {
        id: crypto.randomUUID(),
        date: entryDate,
        category,
        title,
        description,
        link,
        points,
        createdAt: new Date().toISOString(),
      }
      const updatedEntries = [...prev.entries, newEntry]

      // 2. Calculate quest rewards (only for today's entries)
      let questReward = 0
      let updatedDaily = prev.quests.daily

      if (entryDate === today) {
        // daily-health auto-complete
        if (category === 'health') {
          const healthQuest = updatedDaily.find(q => q.id === 'daily-health')
          if (healthQuest && !healthQuest.completed) {
            questReward += healthQuest.reward
            updatedDaily = updatedDaily.map(q =>
              q.id === 'daily-health' ? { ...q, completed: true } : q
            )
          }
        }
      }

      // daily-three auto-complete (count today's entries after adding the new one)
      const todayCount = updatedEntries.filter(e => e.date === today).length
      if (todayCount >= 3) {
        const threeQuest = updatedDaily.find(q => q.id === 'daily-three')
        if (threeQuest && !threeQuest.completed) {
          questReward += threeQuest.reward
          updatedDaily = updatedDaily.map(q =>
            q.id === 'daily-three' ? { ...q, completed: true } : q
          )
        }
      }

      // 3. Compute final EXP and level
      const totalNewExp = prev.profile.exp + points + questReward
      const newLevel = levelFromExp(totalNewExp)
      const prevLevel = prev.profile.level

      let next = {
        ...prev,
        entries: updatedEntries,
        profile: { ...prev.profile, exp: totalNewExp, level: newLevel },
        quests: { ...prev.quests, daily: updatedDaily },
      }

      // 4. Badge & item unlocks
      const { updatedBadges, newlyUnlocked } = checkBadgeUnlocks(next)
      const updatedInventory = checkItemUnlocks(next.inventory, newLevel)
      next = { ...next, badges: updatedBadges, inventory: updatedInventory }

      // 5. Capture side-effect values — setters are called after setState returns
      if (newLevel > prevLevel) capturedLevelUp = { level: newLevel }
      if (newlyUnlocked.length > 0) capturedBadges = newlyUnlocked

      saveState(next)
      return next
    })

    if (capturedLevelUp) setLevelUpInfo(capturedLevelUp)
    if (capturedBadges.length > 0) setNewBadges(prev => [...prev, ...capturedBadges])
  }

  // -------------------------------------------------------------------------
  // completeRandomQuest
  // -------------------------------------------------------------------------
  const completeRandomQuest = (questId) => {
    let capturedLevelUp = null
    let capturedBadges = []

    setState(prev => {
      if (!prev) return prev

      const quest = prev.quests.random.find(q => q.id === questId)
      if (!quest || quest.completed) return prev

      const updatedRandom = prev.quests.random.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      )

      const newExp = prev.profile.exp + quest.reward
      const newLevel = levelFromExp(newExp)
      const prevLevel = prev.profile.level

      let next = {
        ...prev,
        profile: { ...prev.profile, exp: newExp, level: newLevel },
        quests: { ...prev.quests, random: updatedRandom },
      }

      // Badge & item unlocks
      const { updatedBadges, newlyUnlocked } = checkBadgeUnlocks(next)
      const updatedInventory = checkItemUnlocks(next.inventory, newLevel)
      next = { ...next, badges: updatedBadges, inventory: updatedInventory }

      // Capture side-effect values — setters are called after setState returns
      if (newLevel > prevLevel) capturedLevelUp = { level: newLevel }
      if (newlyUnlocked.length > 0) capturedBadges = newlyUnlocked

      saveState(next)
      return next
    })

    if (capturedLevelUp) setLevelUpInfo(capturedLevelUp)
    if (capturedBadges.length > 0) setNewBadges(prev => [...prev, ...capturedBadges])
  }

  // -------------------------------------------------------------------------
  // resetState — clears all progress (for testing)
  // -------------------------------------------------------------------------
  const resetState = () => {
    const fresh = buildInitialState()
    saveState(fresh)
    setState(fresh)
    setLevelUpInfo(null)
    setNewBadges([])
  }

  // -------------------------------------------------------------------------
  // deleteEntry
  // -------------------------------------------------------------------------
  const deleteEntry = (id) => {
    setState(prev => {
      if (!prev) return prev
      const next = { ...prev, entries: prev.entries.filter(e => e.id !== id) }
      saveState(next)
      return next
    })
  }

  // -------------------------------------------------------------------------
  // updateEntry — edits title / category / points / description / link.
  // If points changed, adjusts total EXP by the delta.
  // -------------------------------------------------------------------------
  const updateEntry = (id, changes) => {
    setState(prev => {
      if (!prev) return prev
      const entry = prev.entries.find(e => e.id === id)
      if (!entry) return prev

      const oldPoints = entry.points
      const newPoints = changes.points !== undefined ? Number(changes.points) : oldPoints
      const delta = newPoints - oldPoints

      const updatedEntries = prev.entries.map(e =>
        e.id === id ? { ...e, ...changes, points: newPoints } : e
      )

      const newExp   = prev.profile.exp + delta
      const newLevel = levelFromExp(newExp)

      const next = {
        ...prev,
        entries: updatedEntries,
        profile: { ...prev.profile, exp: newExp, level: newLevel },
      }
      saveState(next)
      return next
    })
  }

  // -------------------------------------------------------------------------
  // Clearers
  // -------------------------------------------------------------------------
  const clearLevelUp = () => setLevelUpInfo(null)
  const clearNewBadges = () => setNewBadges([])

  return {
    state,
    addEntry,
    deleteEntry,
    updateEntry,
    resetState,
    completeRandomQuest,
    levelUpInfo,
    clearLevelUp,
    newBadges,
    clearNewBadges,
  }
}
