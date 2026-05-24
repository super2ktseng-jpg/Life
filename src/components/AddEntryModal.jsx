import { useState } from 'react'
import './AddEntryModal.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

export default function AddEntryModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('daily')
  const [points, setPoints] = useState(10)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), category, Number(points))
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">新增紀錄</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title input */}
          <div className="modal-field">
            <label className="modal-label">事項描述</label>
            <input
              className="modal-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="我今天..."
              autoFocus
            />
          </div>

          {/* Category selector */}
          <div className="modal-field">
            <label className="modal-label">分類</label>
            <div className="category-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${category === cat.id ? 'active' : ''}`}
                  style={category === cat.id ? { borderColor: cat.color, color: cat.color } : {}}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Points input */}
          <div className="modal-field">
            <label className="modal-label">點數 (EXP)</label>
            <input
              className="modal-input modal-input-points"
              type="number"
              min="1"
              max="999"
              value={points}
              onChange={e => setPoints(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>新增 +{points} EXP</button>
          </div>
        </form>
      </div>
    </div>
  )
}
