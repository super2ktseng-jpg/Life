import { useMemo, useState } from 'react'
import './ActivityHeatMap.css'

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']
const WEEKS = 14

function getColor(exp) {
  if (exp < 0)  return 'transparent'       // future date
  if (exp === 0) return 'rgba(255,255,255,0.05)'
  if (exp < 20)  return 'rgba(224,140,10,0.22)'
  if (exp < 50)  return 'rgba(224,140,10,0.45)'
  if (exp < 100) return 'rgba(224,140,10,0.68)'
  return '#e08c0a'
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(m)}月${parseInt(d)}日`
}

export default function ActivityHeatMap({ entries }) {
  const [tooltip, setTooltip] = useState(null) // { date, exp, x, y }

  // Build EXP-by-date map
  const expByDate = useMemo(() => {
    const map = {}
    for (const e of entries) {
      map[e.date] = (map[e.date] || 0) + e.points
    }
    return map
  }, [entries])

  // Build cell grid: 14 cols (weeks) × 7 rows (Mon–Sun)
  const { cells, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Start from Monday of (WEEKS-1) weeks ago
    const dow = (today.getDay() + 6) % 7  // Mon=0 … Sun=6
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
        const isFuture = d > today
        cells.push({
          date: dateStr,
          exp: isFuture ? -1 : (expByDate[dateStr] ?? 0),
          col,
          row,
        })
        // Track month label for the first cell of each month
        if (row === 0) {
          const monthKey = dateStr.slice(0, 7)
          if (!seenMonths.has(monthKey)) {
            seenMonths.add(monthKey)
            monthLabels.push({ col, label: `${parseInt(dateStr.slice(5, 7))}月` })
          }
        }
      }
    }

    return { cells, monthLabels }
  }, [expByDate])

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-header">
        <span className="sec-label" style={{ margin: 0 }}>活躍度</span>
        <span className="heatmap-legend">
          <span className="heatmap-legend-label">少</span>
          {[0, 20, 50, 100, 150].map(v => (
            <span
              key={v}
              className="heatmap-legend-cell"
              style={{ background: getColor(v === 0 ? 0 : v) }}
            />
          ))}
          <span className="heatmap-legend-label">多</span>
        </span>
      </div>

      <div className="heatmap-body">
        {/* Day-of-week labels */}
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
          {/* Month labels */}
          <div className="heatmap-months" style={{ gridTemplateColumns: `repeat(${WEEKS}, 14px)` }}>
            {monthLabels.map(({ col, label }) => (
              <span
                key={col}
                className="heatmap-month-label"
                style={{ gridColumn: col + 1 }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Cell grid */}
          <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 14px)` }}>
            {cells.map(cell => (
              <div
                key={cell.date}
                className="heatmap-cell"
                style={{
                  gridColumn: cell.col + 1,
                  gridRow: cell.row + 1,
                  background: getColor(cell.exp),
                  border: cell.exp > 0 && cell.exp >= 0
                    ? '1px solid rgba(224,140,10,0.2)'
                    : '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => {
                  if (cell.exp < 0) return
                  setTooltip({ date: cell.date, exp: cell.exp })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="heatmap-tooltip">
          <strong>{formatDate(tooltip.date)}</strong>
          <span>{tooltip.exp === 0 ? '無記錄' : `+${tooltip.exp} EXP`}</span>
        </div>
      )}
    </div>
  )
}
