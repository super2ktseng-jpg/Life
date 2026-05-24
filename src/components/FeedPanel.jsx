import { useState } from 'react'
import EntryCard from './EntryCard'
import './FeedPanel.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })
}

export default function FeedPanel({ state, onOpenAdd }) {
  const [filter, setFilter] = useState('all')

  const today = new Date().toISOString().slice(0, 10)

  const displayEntries = state.entries
    .filter(e => e.date === today)
    .filter(e => filter === 'all' || e.category === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const todayExp = state.entries
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.points, 0)

  return (
    <div className="feed-panel">
      {/* Date header */}
      <div className="feed-header">
        <div className="feed-date">
          <span className="feed-date-label">今日紀錄</span>
          <span className="feed-date-value">{formatDate(today)}</span>
        </div>
        <div className="feed-today-exp">+{todayExp} EXP</div>
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
            style={filter === cat.id ? { borderColor: cat.color, color: cat.color } : {}}
            onClick={() => setFilter(cat.id)}
          >{cat.label}</button>
        ))}
      </div>

      {/* Entry list */}
      <div className="feed-list">
        {displayEntries.length === 0 ? (
          <div className="feed-empty">
            <p>今天還沒有紀錄</p>
            <p className="feed-empty-sub">點擊下方按鈕開始記錄！</p>
          </div>
        ) : (
          displayEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

    </div>
  )
}
