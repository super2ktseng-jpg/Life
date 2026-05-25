import { useState, useEffect, useCallback } from 'react'
import { todayStr } from '../utils/dateUtils'
import './AddEntryModal.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常',  color: '#fbbf24' },
  { id: 'health',   label: '健康',  color: '#34d399' },
  { id: 'learning', label: '學習',  color: '#60a5fa' },
  { id: 'social',   label: '社群',  color: '#a78bfa' },
  { id: 'emotion',  label: '情感',  color: '#f472b6' },
]

const DESC_MAX = 100
const POINT_PRESETS = [5, 10, 20, 30, 50]

export default function AddEntryModal({ onClose, onAdd, editEntry, onUpdate }) {
  const isEditing = !!editEntry

  const [title, setTitle]             = useState(editEntry?.title       ?? '')
  const [category, setCategory]       = useState(editEntry?.category    ?? 'daily')
  const [points, setPoints]           = useState(editEntry?.points      ?? 10)
  const [description, setDescription] = useState(editEntry?.description ?? '')
  const [link, setLink]               = useState(editEntry?.link        ?? '')
  const [date, setDate]               = useState(editEntry?.date        ?? todayStr())

  // ESC to close
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const adjustPoints = useCallback((delta) => {
    setPoints(p => Math.max(1, Math.min(999, Number(p) + delta)))
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    if (isEditing) {
      onUpdate(editEntry.id, {
        title: title.trim(),
        category,
        points: Number(points),
        description: description.trim(),
        link: link.trim(),
        date,
      })
    } else {
      onAdd(title.trim(), category, Number(points), description.trim(), link.trim(), date)
    }
  }

  const activeCat = CATEGORIES.find(c => c.id === category)

  return (
    <div className="modal-backdrop">
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">{isEditing ? '編輯紀錄' : '新增紀錄'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="關閉">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="entry-title">
              事項名稱 <span className="modal-required">*</span>
            </label>
            <input
              id="entry-title"
              className="modal-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="我今天做了什麼..."
              autoFocus
              maxLength={80}
              autoComplete="off"
            />
          </div>

          {/* Date */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="entry-date">
              日期
              {date !== todayStr() && (
                <span className="modal-date-badge">補記</span>
              )}
            </label>
            <input
              id="entry-date"
              className="modal-input modal-date-input"
              type="date"
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
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
                  style={category === cat.id
                    ? { borderColor: cat.color, color: cat.color, background: `${cat.color}1a` }
                    : {}}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Points */}
          <div className="modal-field">
            <label className="modal-label">EXP 點數</label>
            <div className="points-row">
              {/* Quick presets */}
              <div className="points-presets">
                {POINT_PRESETS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`points-preset ${points === p ? 'active' : ''}`}
                    style={points === p && activeCat
                      ? { borderColor: activeCat.color, color: activeCat.color, background: `${activeCat.color}1a` }
                      : {}}
                    onClick={() => setPoints(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Stepper */}
              <div className="points-stepper">
                <button type="button" className="stepper-btn" onClick={() => adjustPoints(-1)}
                  aria-label="減少點數">−</button>
                <input
                  className="stepper-input"
                  type="number"
                  min="1" max="999"
                  value={points}
                  onChange={e => setPoints(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                  aria-label="點數"
                />
                <button type="button" className="stepper-btn" onClick={() => adjustPoints(1)}
                  aria-label="增加點數">+</button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="entry-desc">
              描述 <span className="modal-optional">（選填）</span>
            </label>
            <div className="modal-textarea-wrap">
              <textarea
                id="entry-desc"
                className="modal-textarea"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, DESC_MAX))}
                placeholder="補充說明..."
                rows={2}
              />
              <span className={`modal-char-count ${description.length >= DESC_MAX ? 'at-limit' : ''}`}>
                {description.length}/{DESC_MAX}
              </span>
            </div>
          </div>

          {/* Link */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="entry-link">
              連結 <span className="modal-optional">（選填）</span>
            </label>
            <input
              id="entry-link"
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
            <button
              type="submit"
              className="btn-submit"
              disabled={!title.trim()}
              style={activeCat ? { '--cat-color': activeCat.color } : {}}
            >
              {isEditing ? '儲存更改' : `新增 +${points} EXP`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
