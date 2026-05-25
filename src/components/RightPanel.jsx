import QuestCard from './QuestCard'
import { ITEM_DEFINITIONS } from '../data/itemDefinitions'
import './RightPanel.css'

const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="5.5" width="8" height="6" rx="1"/>
    <path d="M4.5 5.5V3.5a2 2 0 014 0v2"/>
  </svg>
)

export default function RightPanel({ state, onCompleteRandomQuest }) {
  return (
    <div className="right-panel">
      {/* Daily Quests */}
      <div className="card">
        <div className="sec-label">每日任務</div>
        {state.quests.daily.map(quest => (
          <QuestCard key={quest.id} quest={quest} isDaily={true} onComplete={() => {}} />
        ))}
      </div>

      {/* Random Quests */}
      <div className="card">
        <div className="sec-label">隨機任務</div>
        {state.quests.random.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            isDaily={false}
            onComplete={onCompleteRandomQuest}
          />
        ))}
      </div>

      {/* Inventory */}
      <div className="card">
        <div className="sec-label">道具欄</div>
        <div className="inventory-grid">
          {ITEM_DEFINITIONS.map(def => {
            const item     = state.inventory.find(i => i.id === def.id)
            const unlocked = item?.unlockedAt != null
            return (
              <div
                key={def.id}
                className={`inventory-item ${unlocked ? 'item-unlocked' : 'item-locked'}`}
                title={unlocked ? def.name : `Lv.${def.unlockLevel} 解鎖`}
              >
                <span className="item-emoji">{def.emoji}</span>
                <div className="item-info">
                  <span className="item-name">{def.name}</span>
                  <span className="item-rarity">{def.rarity}</span>
                </div>
                {!unlocked && (
                  <span className="item-lock" aria-label={`Lv.${def.unlockLevel} 解鎖`}>
                    <IconLock />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
