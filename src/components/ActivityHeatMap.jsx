import { useMemo, useState, useCallback } from 'react'
import './ActivityHeatMap.css'

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']
const WEEKS = 14

function getColor(exp) {
  if (exp < 0)   return 'transparent'
  if (exp === 0) return 'rgba(255,255,255,0.06)'
  if (exp < 20)  return 'rgba(224,140,10,0.25)'
  if (exp < 50)  return 'rgba(224,140,10,0.48)'
  if (exp < 100) return 'rgba(224,140,10,0.70)'
  return '#e08c0a'
}

function formatDate(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}月${parseInt(d)}日`
}

export default function ActivityHeatMap({ entries }) {
  // tooltip: { date, exp, x, y } — coordinates are viewport-relative (for position:fixed)
  const [tooltip, setTooltip] = useState(null)

  const expByDate = useMemo(() => {
    const map = {}
    for (const e of entries) {
      map[e.date] = (map[e.date] || 0) + e.points
    }
    return map
  }, [entries])

  const { cells, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dow = (today.getDay() + 6) % 7          // Mon=0
    const start = new Date(today)
    start.setDate(today.getDate() - dow - (WEEKS - 1) * 7)

    const cells = []
    const seenMonths = new Set()
    const monthLabels = []

    for (let col = 0; col < WEEKS; col++) {
      for (let row = 0; row < 7; row++) {
        const d = new Date(start)
        d.setDate(start.getDate() + col * 7 + row)
        const dateStr = d.toISOString().slice(0, 10)
        cells.push({
          date: dateStr,
          exp: d > today ? -1 : (expByDate[dateStr] ?? 0),
          col, row,
        })
        if (row === 0) {
          const mk = dateStr.slice(0, 7)
          if (!seenMonths.has(mk)) {
            seenMonths.add(mk)
            monthLabels.push({ col, label: `${parseInt(dateStr.slice(5, 7))}月` })
          }
        }
      }
    }
    return { cells, monthLabels }
  }, [expByDate])

  const handleEnter = useCallback((e, cell) => {
    if (cell.exp < 0) return
    const r = e.currentTarget.getBoundingClientRect()
    setTooltip({ date: cell.date, exp: cell.exp, x: r.left + r.width / 2, y: r.top })
  }, [])

  const handleLeave = useCallback(() => setTooltip(null), [])

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-header">
        <span className="sec-label" style={{ margin: 0 }}>活躍度</span>
        <span className="heatmap-legend">
          <span className="heatmap-legend-label">少</span>
          {[0, 20, 50, 100, 150].map(v => (
            <span key={v} className="heatmap-legend-cell"
              style={{ background: getColor(v === 0 ? 0 : v) }} />
          ))}
          <span className="heatmap-legend-label">多</span>
        </span>
      </div>

      <div className="heatmap-body">
        {/* Day labels */}
        <div className="heatmap-days">
          {DAY_LABELS.map((d, i) => (
            <span key={i} className="heatmap-day-label"
              style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="heatmap-grid-wrap">
          {/* Month row */}
          <div className="heatmap-months">
            {monthLabels.map(({ col, label }) => (
              <span key={col} className="heatmap-month-label"
                style={{ gridColumn: col + 1 }}>{label}</span>
            ))}
          </div>

          {/* Cell grid */}
          <div className="heatmap-grid">
            {cells.map(cell => (
              <div
                key={cell.date}
                className={`heatmap-cell${cell.exp > 0 ? ' heatmap-cell--active' : ''}`}
                style={{
                  gridColumn: cell.col + 1,
                  gridRow: cell.row + 1,
                  background: getColor(cell.exp),
                }}
                onMouseEnter={e => handleEnter(e, cell)}
                onMouseLeave={handleLeave}
                aria-label={cell.exp >= 0 ? `${formatDate(cell.date)}: ${cell.exp} EXP` : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip — fixed to viewport so overflow:hidden on parents never clips it */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          aria-live="polite"
        >
          <strong>{formatDate(tooltip.date)}</strong>
          <span>{tooltip.exp === 0 ? '無記錄' : `+${tooltip.exp} EXP`}</span>
        </div>
      )}
    </div>
  )
}
