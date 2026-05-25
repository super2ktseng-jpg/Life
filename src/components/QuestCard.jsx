import './QuestCard.css'

const IconCheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="6.5"/>
    <polyline points="4.5,7.5 6.5,9.5 10.5,5.5"/>
  </svg>
)

const IconCircle = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.5" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="6.5"/>
  </svg>
)

export default function QuestCard({ quest, isDaily, onComplete }) {
  return (
    <div className={`quest-card ${quest.completed ? 'quest-done' : ''}`}>
      <div className="quest-card-left">
        {isDaily ? (
          <span className={`quest-check ${quest.completed ? 'checked' : ''}`}
            aria-label={quest.completed ? '已完成' : '未完成'}>
            {quest.completed ? <IconCheckCircle /> : <IconCircle />}
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
        <span className="quest-done-badge" aria-label="已完成">
          <IconCheckCircle />
        </span>
      )}
    </div>
  )
}
