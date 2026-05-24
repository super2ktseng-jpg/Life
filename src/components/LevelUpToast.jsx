import { useEffect } from 'react'
import { ITEM_DEFINITIONS } from '../data/itemDefinitions'
import './LevelUpToast.css'

export default function LevelUpToast({ level, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  // Check if this level unlocks an item
  const newItem = ITEM_DEFINITIONS.find(def => def.unlockLevel === level) ?? null

  return (
    <div className="levelup-backdrop" onClick={onClose}>
      <div className="levelup-box">
        <div className="levelup-glow" />
        <div className="levelup-label">LEVEL UP!</div>
        <div className="levelup-number">Lv.{level}</div>
        {newItem ? (
          <div className="levelup-item">
            <span className="levelup-item-emoji">{newItem.emoji}</span>
            <span className="levelup-item-name">獲得：{newItem.name}</span>
            <span className="levelup-item-rarity">{newItem.rarity}</span>
          </div>
        ) : (
          <div className="levelup-sub">繼續努力！</div>
        )}
        <button className="levelup-btn" onClick={onClose}>繼續</button>
      </div>
    </div>
  )
}
