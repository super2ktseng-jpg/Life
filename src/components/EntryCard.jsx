import './EntryCard.css'

const CATEGORIES = [
  { id: 'daily',    label: '日常', color: '#fbbf24' },
  { id: 'health',   label: '健康', color: '#34d399' },
  { id: 'learning', label: '學習', color: '#60a5fa' },
  { id: 'social',   label: '社群', color: '#a78bfa' },
  { id: 'emotion',  label: '情感', color: '#f472b6' },
]

export default function EntryCard({ entry }) {
  const cat = CATEGORIES.find(c => c.id === entry.category)
  const categoryColor = cat ? cat.color : '#7a8394'
  const categoryLabel = cat ? cat.label : entry.category

  const time = new Date(entry.createdAt).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="entry-card">
      <span className="entry-dot" style={{ background: categoryColor }} />
      <div className="entry-body">
        <span className="entry-title">{entry.title}</span>
        {entry.description && (
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
      <span className="entry-pts">+{entry.points}</span>
    </div>
  )
}
