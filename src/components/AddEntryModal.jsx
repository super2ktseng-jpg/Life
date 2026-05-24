import { useState } from 'react'
import './AddEntryModal.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

const DESC_MAX = 100

export default function AddEntryModal({ onClose, onAdd }) {
  const [title, setTitle]           = useState('')
  const [category, setCategory]     = useState('daily')
  const [points, setPoints]         = useState(10)
  const [description, setDescription] = useState('')
  const [link, setLink]             = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), category, Number(points), description.trim(), link.trim())
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">新增紀錄</h2>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="modal-field">
            <label className="modal-label">事項名稱 <span className="modal-required">*</span></label>
            <input
              className="modal-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="我今天..."
              autoFocus
              maxLength={80}
            />
          </div>

          {/* Category */}
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

          {/* Points */}
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

          {/* Description */}
          <div className="modal-field">
            <label className="modal-label">
              描述
              <span className="modal-optional">（選填）</span>
            </label>
            <div className="modal-textarea-wrap">
              <textarea
                className="modal-textarea"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, DESC_MAX))}
                placeholder="補充說明..."
                rows={3}
              />
              <span className={`modal-char-count ${description.length >= DESC_MAX ? 'at-limit' : ''}`}>
                {description.length}/{DESC_MAX}
              </span>
            </div>
          </div>

          {/* Link */}
          <div className="modal-field">
            <label className="modal-label">
              連結
              <span className="modal-optional">（選填）</span>
            </label>
            <input
              className="modal-input"
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://..."
              inputMode="url"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>
              新增 +{points} EXP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
