import { useState } from 'react'
import './LeftPanel.css'
import CatSprite from './CatSprite'
import RadarChart from './RadarChart'
import { BADGE_DEFINITIONS } from '../data/badgeDefinitions'
import { ITEM_DEFINITIONS } from '../data/itemDefinitions'
import { expForLevel, expAtLevelStart } from '../utils/levelUtils'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

export default function LeftPanel({ state }) {
  const [statsOpen, setStatsOpen] = useState(false)

  // Section 1: Cat card — XP calculations
  const { level, exp } = state.profile
  const levelStart = expAtLevelStart(level)
  const expInLevel = exp - levelStart
  const expNeeded = expForLevel(level)
  const pct = Math.min(100, Math.round((expInLevel / expNeeded) * 100))

  // Highest equipped item (for overlay)
  const equippedItem = ITEM_DEFINITIONS
    .filter(def => level >= def.unlockLevel)
    .sort((a, b) => b.unlockLevel - a.unlockLevel)[0] ?? null

  // Next item to unlock
  const nextItem = ITEM_DEFINITIONS
    .filter(def => def.unlockLevel > level)
    .sort((a, b) => a.unlockLevel - b.unlockLevel)[0] ?? null

  // Section 2: Category bars — compute points per category
  const catPtsMap = {}
  for (const cat of CATEGORIES) {
    catPtsMap[cat.id] = state.entries
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.points, 0)
  }

  return (
    <div className="left-panel">

      {/* Section 1: Cat card */}
      <div className="card cat-card">
        <div className="cat-level-badge">Lv.{level}</div>
        <div className="cat-canvas-wrap">
          <div className="cat-canvas-inner">
            <CatSprite scale={8} level={level} />
            {equippedItem && (
              <span className="cat-equip-badge" title={equippedItem.name}>
                {equippedItem.emoji}
              </span>
            )}
          </div>
        </div>
        <div className="xp-section">
          <div className="xp-label-row">
            <span className="xp-label">EXP</span>
            <span className="xp-numbers">{expInLevel} / {expNeeded}</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          {nextItem && (
            <div className="next-item-hint">
              下一級 Lv.{nextItem.unlockLevel}: {nextItem.emoji} {nextItem.name}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Radar chart */}
      <div className="card radar-card">
        <div className="sec-label">分類統計</div>
        <div className="radar-wrap">
          <RadarChart
            data={CATEGORIES.map(cat => ({
              id:    cat.id,
              label: cat.label,
              color: cat.color,
              value: catPtsMap[cat.id],
            }))}
          />
        </div>

        {/* Toggle button for stats + badges */}
        <button
          className="stats-toggle-btn"
          onClick={() => setStatsOpen(o => !o)}
          aria-expanded={statsOpen}
        >
          {statsOpen ? '▲' : '▼'} 統計 & 徽章
        </button>
      </div>

      {/* Section 3: Stats grid — collapsible */}
      {statsOpen && (
        <>
          <div className="card">
            <div className="sec-label">統計</div>
            <div className="stats-grid">
              <div className="stat-tile">
                <span className="stat-value">{state.entries.length}</span>
                <span className="stat-label">總紀錄</span>
              </div>
              <div className="stat-tile">
                <span className="stat-value">{state.profile.streak}</span>
                <span className="stat-label">連續天數</span>
              </div>
              <div className="stat-tile">
                <span className="stat-value">{state.profile.level}</span>
                <span className="stat-label">等級</span>
              </div>
              <div className="stat-tile">
                <span className="stat-value">{state.profile.exp}</span>
                <span className="stat-label">總 EXP</span>
              </div>
            </div>
          </div>

          {/* Section 4: Badges */}
          <div className="card">
            <div className="sec-label">徽章</div>
            <div className="badges-grid">
              {BADGE_DEFINITIONS.map(def => {
                const badge = state.badges.find(b => b.id === def.id)
                const unlocked = badge?.unlockedAt != null
                return (
                  <div
                    key={def.id}
                    className={`badge-tile ${unlocked ? 'badge-unlocked' : 'badge-locked'}`}
                    title={def.description}
                  >
                    <span className="badge-emoji">{def.emoji}</span>
                    <span className="badge-name">{def.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

    </div>
  )
}
