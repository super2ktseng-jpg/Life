import './QuestCard.css'

export default function QuestCard({ quest, isDaily, onComplete }) {
  return (
    <div className={`quest-card ${quest.completed ? 'quest-done' : ''}`}>
      <div className="quest-card-left">
        {isDaily ? (
          <span className={`quest-check ${quest.completed ? 'checked' : ''}`}>
            {quest.completed ? '✓' : '○'}
          </span>
        ) : null}
        <div className="quest-card-body">
          <span className="quest-title">{quest.title}</span>
          <span className="quest-reward">+{quest.reward} EXP</span>
        </div>
      </div>
      {!isDaily && !quest.completed && (
        <button className="quest-complete-btn" onClick={() => onComplete(quest.id)}>
          完成
        </button>
      )}
      {!isDaily && quest.completed && (
        <span className="quest-done-badge">✓</span>
      )}
    </div>
  )
}
