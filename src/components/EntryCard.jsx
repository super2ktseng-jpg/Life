import { useState } from 'react'
import { CATEGORIES } from '../data/categories'
import './EntryCard.css'

// ── Inline SVG icons ──────────────────────────────────────────
const IconLink = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7"/>
    <path d="M7.5 1H11m0 0v3.5M11 1L5.5 6.5"/>
  </svg>
)
const IconEdit = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 1.5L10.5 3.5 4 10H2V8l6.5-6.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="1.5,3 10.5,3"/>
    <path d="M4 3V2h4v1"/>
    <path d="M3 3l.75 7.5h4.5L9 3"/>
  </svg>
)

export default function EntryCard({ entry, onDelete, onEdit }) {
  const [expanded, setExpanded]         = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const cat           = CATEGORIES.find(c => c.id === entry.category)
  const categoryColor = cat ? cat.color : '#7a8394'
  const categoryLabel = cat ? cat.label : entry.category

  const time = new Date(entry.createdAt).toLocaleTimeString('zh-TW', {
    hour: '2-digit', minute: '2-digit',
  })

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(entry.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  function handleEdit(e) {
    e.stopPropagation()
    onEdit(entry)
  }

  return (
    <div
      className={`entry-card ${expanded ? 'entry-expanded' : ''}`}
      onClick={() => setExpanded(ex => !ex)}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={e => e.key === 'Enter' && setExpanded(ex => !ex)}
    >
      {/* Always-visible summary row */}
      <div className="entry-row">
        <span className="entry-dot" style={{ background: categoryColor }} aria-hidden="true" />
        <div className="entry-body">
          <span className="entry-title">{entry.title}</span>
          {!expanded && entry.description && (
            <span className="entry-desc">{entry.description}</span>
          )}
          <div className="entry-bottom">
            <span className="entry-meta">{categoryLabel} · {time}</span>
            {entry.link && (
              <a
                className="entry-link"
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="開啟連結"
                onClick={e => e.stopPropagation()}
              >
                <IconLink />
              </a>
            )}
          </div>
        </div>
        <div className="entry-right">
          <span className="entry-pts">+{entry.points}</span>
          <span className="entry-chevron" aria-hidden="true">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Animated expand/collapse — always in DOM, height via grid */}
      <div className="entry-detail-wrap" aria-hidden={!expanded}>
        <div className="entry-detail-inner">
          <div className="entry-detail" onClick={e => e.stopPropagation()}>
            {entry.description && (
              <p className="entry-detail-desc">{entry.description}</p>
            )}
            {entry.link && (
              <a
                className="entry-detail-link"
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconLink /> {entry.link}
              </a>
            )}
            <div className="entry-actions">
              <button className="entry-edit-btn" onClick={handleEdit} aria-label="編輯紀錄">
                <IconEdit /> 編輯
              </button>
              <button
                className={`entry-delete-btn ${confirmDelete ? 'delete-confirm' : ''}`}
                onClick={handleDelete}
                aria-label={confirmDelete ? '確認刪除' : '刪除紀錄'}
              >
                <IconTrash /> {confirmDelete ? '確認刪除？' : '刪除'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
