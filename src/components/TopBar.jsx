import './TopBar.css'

export default function TopBar({ streak }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <span className="topbar-icon">⚔️</span>
        <span className="topbar-name">Life RPG</span>
      </div>
      <div className="topbar-streak">
        <span>🔥</span>
        <span>{streak} 天連續</span>
      </div>
    </header>
  )
}
