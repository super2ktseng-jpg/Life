/**
 * Pure-SVG radar / spider chart — value labels appear on hover only,
 * placed INSIDE the polygon to avoid overlapping axis name labels.
 */
import { useState } from 'react'

export default function RadarChart({ data }) {
  const SIZE   = 180
  const CX     = 90
  const CY     = 95
  const MAX_R  = 64
  const LEVELS = 4
  const N      = data.length

  const [hovered, setHovered]     = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  function axisAngle(i) {
    return (Math.PI * 2 * i) / N - Math.PI / 2
  }

  function pt(i, r) {
    const a = axisAngle(i)
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  function polyStr(pts) {
    return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  const maxVal   = Math.max(...data.map(d => d.value), 1)
  const dataPts  = data.map((d, i) => pt(i, (d.value / maxVal) * MAX_R))
  const LABEL_R  = MAX_R + 16  // axis name labels are here

  const gridLevels = Array.from({ length: LEVELS }, (_, li) => {
    const r = (MAX_R * (li + 1)) / LEVELS
    return data.map((_, i) => pt(i, r))
  })

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-label="分類統計雷達圖"
      role="img"
      style={{ overflow: 'visible' }}
    >
      {/* Grid rings */}
      {gridLevels.map((pts, li) => (
        <polygon
          key={li}
          points={polyStr(pts)}
          fill={li === LEVELS - 1 ? 'rgba(255,255,255,0.03)' : 'none'}
          stroke={`rgba(255,255,255,${0.04 + li * 0.025})`}
          strokeWidth={li === LEVELS - 1 ? '1.2' : '1'}
        />
      ))}

      {/* Axis spokes */}
      {data.map((_, i) => {
        const tip = pt(i, MAX_R)
        return (
          <line key={i}
            x1={CX} y1={CY}
            x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        )
      })}

      {/* Data polygon — hover activates all value labels */}
      <polygon
        points={polyStr(dataPts)}
        fill="rgba(224,140,10,0.20)"
        stroke="#e08c0a"
        strokeWidth="1.8"
        strokeLinejoin="round"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setHoveredIdx(null) }}
      />

      {/* Center dot */}
      <circle cx={CX} cy={CY} r="2" fill="rgba(255,255,255,0.18)" />

      {/* Data dots */}
      {dataPts.map((p, i) => (
        <circle key={i}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r={hoveredIdx === i ? 5.5 : 4}
          fill={data[i].color}
          stroke="#111118"
          strokeWidth={hoveredIdx === i ? '1.8' : '1.2'}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => { setHovered(true); setHoveredIdx(i) }}
          onMouseLeave={() => { setHoveredIdx(null) }}
        />
      ))}

      {/* Axis name labels — always visible */}
      {data.map((d, i) => {
        const lp = pt(i, LABEL_R)
        return (
          <text key={i}
            x={lp.x.toFixed(1)}
            y={lp.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="600"
            fill={d.color}
          >
            {d.label}
          </text>
        )
      })}

      {/* Value labels — hover only, placed INSIDE polygon toward center */}
      {hovered && dataPts.map((p, i) => {
        if (data[i].value === 0) return null

        const dotR   = (data[i].value / maxVal) * MAX_R
        // Push label toward center by 18px; clamp so it never goes past center
        const labelR = Math.max(6, dotR - 18)
        const lp     = pt(i, labelR)

        const isMain = hoveredIdx === i
        const isAny  = hoveredIdx === null  // polygon hover shows all equally

        return (
          <text key={i}
            x={lp.x.toFixed(1)}
            y={lp.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={isMain ? '9.5' : '8'}
            fontWeight="700"
            fill={isMain ? data[i].color : isAny ? 'rgba(251,191,36,0.85)' : 'rgba(251,191,36,0.4)'}
            style={{ pointerEvents: 'none' }}
          >
            {data[i].value}
          </text>
        )
      })}
    </svg>
  )
}
