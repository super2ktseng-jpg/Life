import { useState } from 'react'
import './TopBar.css'

export default function TopBar({ streak, onReset }) {
  const [confirming, setConfirming] = useState(false)

  function handleResetClick() {
    if (confirming) {
      onReset()
      setConfirming(false)
    } else {
      setConfirming(true)
      // Auto-cancel after 3 s if user doesn't confirm
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span className="topbar-icon" aria-hidden="true">⚔️</span>
        <span className="topbar-name">Super PRO</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-streak">
          <span aria-hidden="true">🔥</span>
          <span>{streak} 天連續</span>
        </div>

        <button
          className={`reset-btn ${confirming ? 'reset-confirm' : ''}`}
          onClick={handleResetClick}
          title={confirming ? '再按一次確認重置' : '重置所有進度（測試用）'}
          aria-label={confirming ? '確認重置' : '重置進度'}
        >
          {confirming ? '確認？' : '↺ 重置'}
        </button>
      </div>
    </header>
  )
}
