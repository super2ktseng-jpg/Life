import { useState } from 'react'
import './EntryCard.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

export default function EntryCard({ entry, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)

  const cat = CATEGORIES.find(c => c.id === entry.category)
  const categoryColor = cat ? cat.color : '#7a8394'
  const categoryLabel = cat ? cat.label : entry.category

  const time = new Date(entry.createdAt).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  })

  function handleDelete(e) {
    e.stopPropagation()
    onDelete(entry.id)
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
      onKeyDown={e => e.key === 'Enter' && setExpanded(ex => !ex)}
    >
      {/* Always-visible summary row */}
      <div className="entry-row">
        <span className="entry-dot" style={{ background: categoryColor }} />
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
                onClick={e => e.stopPropagation()}
              >
                🔗
              </a>
            )}
          </div>
        </div>
        <div className="entry-right">
          <span className="entry-pts">+{entry.points}</span>
          <span className="entry-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded detail section */}
      {expanded && (
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
              🔗 {entry.link}
            </a>
          )}
          <div className="entry-actions">
            <button className="entry-edit-btn" onClick={handleEdit}>✏️ 編輯</button>
            <button className="entry-delete-btn" onClick={handleDelete}>🗑 刪除記錄</button>
          </div>
        </div>
      )}
    </div>
  )
}
