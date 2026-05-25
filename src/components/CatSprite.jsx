/**
 * CatSprite — tries to load public/cat.png first.
 * If the image is missing or fails, falls back to the canvas-drawn pixel cat.
 * To upgrade to the real photo: save the transparent-bg image as public/cat.png.
 */
import { useState } from 'react'
import CatCanvas from './CatCanvas'
import { CAT_WIDTH } from '../data/catPixels'
import './CatSprite.css'

export default function CatSprite({ scale = 8, level = 1 }) {
  const [imgFailed, setImgFailed] = useState(false)

  // PNG not available (or failed) → use canvas pixel art
  if (imgFailed) {
    return <CatCanvas scale={scale} level={level} />
  }

  return (
    <div className="cat-sprite-wrap" style={{ width: CAT_WIDTH * scale }}>
      <img
        src={`${import.meta.env.BASE_URL}cat.png`}
        className="cat-sprite"
        width={CAT_WIDTH * scale}
        alt="虎斑貓像素藝術"
        draggable={false}
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}
