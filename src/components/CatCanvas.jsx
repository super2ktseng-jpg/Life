import { useEffect, useRef, useCallback } from 'react'
import { CAT_PIXELS, CAT_WIDTH, CAT_HEIGHT } from '../data/catPixels'

// Row 7 replacement for blink (eyes closed — replace iris/pupil with orange)
const BLINK_ROW_7 = [
  null, '#1a0a00', '#d97706', '#d97706', '#1a0a00', '#d97706',
  '#d97706', '#d97706', '#d97706', '#1a0a00', '#d97706', '#1a0a00', null, null,
]

// Small pixel equipment drawn on canvas
function drawEquipment(ctx, scale, level) {
  if (level < 5) return

  if (level >= 20) {
    // Crown — 3 small purple gems above head (rows -1 to 0 area → draw at y=0)
    const purple = '#a78bfa'
    const gem    = '#7c3aed'
    ;[[3,0],[6,0],[9,0]].forEach(([x, y]) => {
      ctx.fillStyle = purple
      ctx.fillRect(x * scale, y * scale, scale, scale)
      ctx.fillStyle = gem
      ctx.fillRect((x + 0.3) * scale, (y + 0.3) * scale, scale * 0.4, scale * 0.4)
    })
  } else if (level >= 10) {
    // Shield — small blue emblem on chest (row 12, cols 5-7)
    const blue = '#60a5fa'
    const dark = '#1e40af'
    ctx.fillStyle = blue
    ctx.fillRect(5 * scale, 12 * scale, scale, scale)
    ctx.fillRect(6 * scale, 11 * scale, scale, scale * 2)
    ctx.fillRect(7 * scale, 12 * scale, scale, scale)
    ctx.fillStyle = dark
    ctx.fillRect(6 * scale, 12 * scale, scale, scale)
  } else if (level >= 5) {
    // Potion glow — amber dot on shoulder (row 11, col 10)
    const amber = '#fbbf24'
    ctx.fillStyle = amber
    ctx.fillRect(10 * scale, 11 * scale, scale, scale)
    ctx.fillStyle = '#fef3c7'
    ctx.fillRect((10.25) * scale, (11.25) * scale, scale * 0.5, scale * 0.5)
  }
}

export default function CatCanvas({ scale = 8, level = 1 }) {
  const canvasRef = useRef(null)

  const drawFrame = useCallback((blinking) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    CAT_PIXELS.forEach((row, y) => {
      const drawRow = (blinking && y === 7) ? BLINK_ROW_7 : row
      drawRow.forEach((color, x) => {
        if (!color) return
        ctx.fillStyle = color
        ctx.fillRect(x * scale, y * scale, scale, scale)
      })
    })

    drawEquipment(ctx, scale, level)
  }, [scale, level])

  // Draw on mount / whenever scale or level changes
  useEffect(() => {
    drawFrame(false)
  }, [drawFrame])

  // Blink interval
  useEffect(() => {
    let blinkTimeout
    function scheduleNextBlink() {
      const delay = 2500 + Math.random() * 2000 // 2.5–4.5 s between blinks
      blinkTimeout = setTimeout(() => {
        drawFrame(true)                         // eyes closed
        setTimeout(() => {
          drawFrame(false)                      // eyes open
          scheduleNextBlink()
        }, 140)
      }, delay)
    }
    scheduleNextBlink()
    return () => clearTimeout(blinkTimeout)
  }, [drawFrame])

  return (
    <canvas
      ref={canvasRef}
      width={CAT_WIDTH * scale}
      height={CAT_HEIGHT * scale}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  )
}
