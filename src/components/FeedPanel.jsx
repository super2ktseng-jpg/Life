import { useState } from 'react'
import EntryCard from './EntryCard'
import ActivityHeatMap from './ActivityHeatMap'
import CatSprite from './CatSprite'
import { todayStr } from '../utils/dateUtils'
import { CATEGORIES } from '../data/categories'
import './FeedPanel.css'

// Parse YYYY-MM-DD as LOCAL date (avoids UTC midnight timezone shift)
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })
}

export default function FeedPanel({ state, onOpenAdd, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all')

  const today = todayStr()

  // All entries, newest date first; within same date newest-created first
  const displayEntries = state.entries
    .filter(e => filter === 'all' || e.category === filter)
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  // Group by date (preserves sort order)
  const dateGroups = []
  const seenDates = new Set()
  for (const entry of displayEntries) {
    if (!seenDates.has(entry.date)) {
      seenDates.add(entry.date)
      dateGroups.push({ date: entry.date, entries: [] })
    }
    dateGroups[dateGroups.length - 1].entries.push(entry)
  }
  // Fix: entries might not be contiguous per date after sort, re-group properly
  const dateMap = {}
  for (const entry of displayEntries) {
    if (!dateMap[entry.date]) dateMap[entry.date] = []
    dateMap[entry.date].push(entry)
  }
  const sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a))

  const todayExp = state.entries
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.points, 0)

  return (
    <div className="feed-panel">

      {/* Header */}
      <div className="feed-header">
        <div className="feed-date">
          <span className="feed-date-label">紀錄</span>
          <span className="feed-date-value">{formatDate(today)}</span>
        </div>
        <div className="feed-today-exp">
          {todayExp > 0 && <span className="feed-exp-badge">今日 +{todayExp} EXP</span>}
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="card heatmap-card">
        <ActivityHeatMap entries={state.entries} />
      </div>

      {/* Filter chips */}
      <div className="feed-filters">
        <button
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >全部</button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`filter-chip ${filter === cat.id ? 'active' : ''}`}
            style={filter === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}14` } : {}}
            onClick={() => setFilter(cat.id)}
          >{cat.label}</button>
        ))}
      </div>

      {/* Entry list — grouped by date */}
      <div className="feed-list">
        {displayEntries.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-cat">
              <CatSprite scale={6} level={state.profile.level} />
            </div>
            <p className="feed-empty-title">
              {filter === 'all'
                ? '還沒有任何紀錄'
                : `「${CATEGORIES.find(c => c.id === filter)?.label}」尚無紀錄`}
            </p>
            <p className="feed-empty-sub">點選右下角「新增紀錄」開始累積 EXP！</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="date-group">
              <div className="date-group-header">
                {date === today && <span className="date-group-today">今日</span>}
                <span className="date-group-label">{formatDate(date)}</span>
              </div>
              {dateMap[date].map(entry => (
                <EntryCard key={entry.id} entry={entry} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          ))
        )}
      </div>

    </div>
  )
}
