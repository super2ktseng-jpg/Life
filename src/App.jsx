import './App.css'
import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import TopBar from './components/TopBar'
import LeftPanel from './components/LeftPanel'
import FeedPanel from './components/FeedPanel'
import AddEntryModal from './components/AddEntryModal'
import RightPanel from './components/RightPanel'
import LevelUpToast from './components/LevelUpToast'

function App() {
  const {
    state,
    addEntry,
    deleteEntry,
    resetState,
    completeRandomQuest,
    levelUpInfo,
    clearLevelUp,
  } = useGameState()

  const [showAddModal, setShowAddModal] = useState(false)

  // Show loading state while hook initialises
  if (!state) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#7a8394' }}>
        載入中...
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      <TopBar streak={state.profile.streak} onReset={resetState} />

      <div className="app-layout">
        <div className="left-col">
          <LeftPanel state={state} />
        </div>

        <FeedPanel
          state={state}
          onOpenAdd={() => setShowAddModal(true)}
          onDelete={deleteEntry}
        />

        <div className="right-col">
          <RightPanel
            state={state}
            onCompleteRandomQuest={completeRandomQuest}
          />
        </div>
      </div>

      {/* FAB — always-visible add button */}
      <button className="fab-add" onClick={() => setShowAddModal(true)} aria-label="新增紀錄">
        <span className="fab-icon">＋</span>
        <span className="fab-text">新增紀錄</span>
      </button>

      {showAddModal && (
        <AddEntryModal
          onClose={() => setShowAddModal(false)}
          onAdd={(title, category, points, description, link) => {
            addEntry(title, category, points, description, link)
            setShowAddModal(false)
          }}
        />
      )}

      {levelUpInfo && (
        <LevelUpToast
          level={levelUpInfo.level}
          onClose={clearLevelUp}
        />
      )}
    </div>
  )
}

export default App
