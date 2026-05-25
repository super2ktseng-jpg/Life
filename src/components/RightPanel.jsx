import QuestCard from './QuestCard'
import { ITEM_DEFINITIONS } from '../data/itemDefinitions'
import './RightPanel.css'

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
            const item = state.inventory.find(i => i.id === def.id)
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
                {!unlocked && <span className="item-lock">🔒</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
