import { useEffect, useRef } from 'react'
import { CAT_PIXELS, CAT_WIDTH, CAT_HEIGHT } from '../data/catPixels'

export default function CatCanvas({ scale = 8 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    CAT_PIXELS.forEach((row, y) => {
      row.forEach((color, x) => {
        if (!color) return
        ctx.fillStyle = color
        ctx.fillRect(x * scale, y * scale, scale, scale)
      })
    })
  }, [scale])

  return (
    <canvas
      ref={canvasRef}
      width={CAT_WIDTH * scale}
      height={CAT_HEIGHT * scale}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  )
}
