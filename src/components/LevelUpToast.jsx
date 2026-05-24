import { useEffect } from 'react'
import './LevelUpToast.css'

export default function LevelUpToast({ level, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="levelup-backdrop" onClick={onClose}>
      <div className="levelup-box">
        <div className="levelup-glow" />
        <div className="levelup-label">LEVEL UP!</div>
        <div className="levelup-number">Lv.{level}</div>
        <div className="levelup-sub">繼續努力！</div>
        <button className="levelup-btn" onClick={onClose}>繼續</button>
      </div>
    </div>
  )
}
