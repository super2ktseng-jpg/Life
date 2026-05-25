import { useEffect, useRef } from 'react'
import { CAT_PIXELS, CAT_WIDTH, CAT_HEIGHT } from '../data/catPixels'

// Eyes are rows 6 & 7 — both solid 2×2 black when open.
// Blink replaces those rows with all-orange (closed eyelids).
// Row open:  [k, o, o, k, k, o, o, o, k, k, o, o, k, _]
// Row blink: [k, o, o, o, o, o, o, o, o, o, o, o, k, _]
const BLINK_EYE = [
  '#1a1a1a', '#e8920a', '#e8920a', '#e8920a', '#e8920a', '#e8920a',
  '#e8920a', '#e8920a', '#e8920a', '#e8920a', '#e8920a', '#e8920a', '#1a1a1a', null,
]

function drawEquipment(ctx, scale, level) {
  if (level < 5) return
  if (level >= 20) {
    // Crown — 3 violet gem dots above head
    ;[[3, 0], [6, 0], [9, 0]].forEach(([x, y]) => {
      ctx.fillStyle = '#a78bfa'
      ctx.fillRect(x * scale, y * scale, scale, scale)
      ctx.fillStyle = '#6d28d9'
      ctx.fillRect((x + 0.25) * scale, (y + 0.25) * scale, scale * 0.5, scale * 0.5)
    })
  } else if (level >= 10) {
    // Shield glyph — small blue 3×3 on chest
    const pts = [[5,11],[6,11],[7,11],[5,12],[7,12],[6,12]]
    pts.forEach(([x, y]) => {
      ctx.fillStyle = '#60a5fa'
      ctx.fillRect(x * scale, y * scale, scale, scale)
    })
    ctx.fillStyle = '#1e40af'
    ctx.fillRect(6 * scale, 12 * scale, scale, scale)
  } else {
    // Potion glow dot — amber on right shoulder
    ctx.fillStyle = '#fbbf24'
    ctx.fillRect(10 * scale, 11 * scale, scale, scale)
    ctx.fillStyle = '#fef3c7'
    ctx.fillRect((10.25) * scale, (11.25) * scale, scale * 0.5, scale * 0.5)
  }
}

export default function CatCanvas({ scale = 8, level = 1 }) {
  const canvasRef = useRef(null)

  // Keep latest scale/level accessible inside the animation closure without restarts
  const scaleRef = useRef(scale)
  const levelRef = useRef(level)
  useEffect(() => { scaleRef.current = scale }, [scale])
  useEffect(() => { levelRef.current = level }, [level])

  // Single rAF loop + blink scheduler — runs once for the lifetime of the component
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId
    let lastTs = 0
    let tick = 0
    const blinkState = { active: false }
    let blinkTimeout

    function draw() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const s = scaleRef.current
      const l = levelRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Tail sway: ±1 px horizontal, ~4 s cycle
      const tailOffset = prefersReduced ? 0 : Math.round(Math.sin(tick * 0.06) * 1.3)

      CAT_PIXELS.forEach((row, y) => {
        const isEyeRow = y === 6 || y === 7
        const drawRow = (!prefersReduced && blinkState.active && isEyeRow) ? BLINK_EYE : row
        const xOff = (y === 19) ? tailOffset : 0
        drawRow.forEach((color, x) => {
          if (!color) return
          const dx = x + xOff
          if (dx < 0 || dx >= CAT_WIDTH) return
          ctx.fillStyle = color
          ctx.fillRect(dx * s, y * s, s, s)
        })
      })

      drawEquipment(ctx, s, l)
      tick++
    }

    function loop(ts) {
      // ~20 fps — no reason to redraw at 60fps for pixel art
      if (ts - lastTs >= 50) {
        lastTs = ts
        draw()
      }
      rafId = requestAnimationFrame(loop)
    }

    function scheduleBlink() {
      blinkTimeout = setTimeout(() => {
        blinkState.active = true
        setTimeout(() => {
          blinkState.active = false
          scheduleBlink()
        }, 150)
      }, 2500 + Math.random() * 2500)
    }

    rafId = requestAnimationFrame(loop)
    if (!prefersReduced) scheduleBlink()

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(blinkTimeout)
    }
  }, []) // intentional empty deps — uses refs for live values

  return (
    <canvas
      ref={canvasRef}
      width={CAT_WIDTH * scale}
      height={CAT_HEIGHT * scale}
      style={{ imageRendering: 'pixelated', display: 'block' }}
      aria-label="虎斑貓像素藝術"
      role="img"
    />
  )
}
