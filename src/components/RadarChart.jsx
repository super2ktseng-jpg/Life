/**
 * Pure-SVG radar / spider chart for 5 categories.
 * No external dependencies.
 */
export default function RadarChart({ data }) {
  // data: [{ id, label, color, value }]
  const SIZE    = 170
  const CX      = 85
  const CY      = 90   // slightly lower to leave label room at top
  const MAX_R   = 58
  const LEVELS  = 5
  const N       = data.length

  /** Cartesian angle for axis i (start at top, clockwise) */
  function axisAngle(i) {
    return (Math.PI * 2 * i) / N - Math.PI / 2
  }

  /** Point on axis i at radius r */
  function pt(i, r) {
    const a = axisAngle(i)
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  function polyStr(pts) {
    return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  // Normalise to max value across all categories
  const maxVal = Math.max(...data.map(d => d.value), 1)

  // Grid level polygons
  const gridLevels = Array.from({ length: LEVELS }, (_, li) => {
    const r = (MAX_R * (li + 1)) / LEVELS
    return data.map((_, i) => pt(i, r))
  })

  // Data polygon (gold fill)
  const dataPts = data.map((d, i) => pt(i, (d.value / maxVal) * MAX_R))

  // Label offset: push label a bit further than MAX_R
  const LABEL_OFFSET = 14

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-label="分類統計雷達圖"
      role="img"
    >
      {/* Grid rings */}
      {gridLevels.map((pts, li) => (
        <polygon
          key={li}
          points={polyStr(pts)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* Axis spokes */}
      {data.map((_, i) => {
        const tip = pt(i, MAX_R)
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={tip.x.toFixed(1)} y2={tip.y.toFixed(1)}
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data fill */}
      <polygon
        points={polyStr(dataPts)}
        fill="rgba(224,140,10,0.18)"
        stroke="#e08c0a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Category colour dots on data points */}
      {dataPts.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r="3.5"
          fill={data[i].color}
          stroke="#111118"
          strokeWidth="1"
        />
      ))}

      {/* Axis labels */}
      {data.map((d, i) => {
        const labelPt = pt(i, MAX_R + LABEL_OFFSET)
        return (
          <text
            key={i}
            x={labelPt.x.toFixed(1)}
            y={labelPt.y.toFixed(1)}
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

      {/* Value labels on data dots (only show non-zero) */}
      {dataPts.map((p, i) => {
        if (data[i].value === 0) return null
        const a = axisAngle(i)
        const offset = 9
        return (
          <text
            key={i}
            x={(p.x + offset * Math.cos(a)).toFixed(1)}
            y={(p.y + offset * Math.sin(a)).toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="rgba(251,191,36,0.85)"
          >
            {data[i].value}
          </text>
        )
      })}
    </svg>
  )
}
