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
      <TopBar streak={state.profile.streak} />

      <div className="app-layout">
        <div className="left-col">
          <LeftPanel state={state} />
        </div>

        <FeedPanel
          state={state}
          onOpenAdd={() => setShowAddModal(true)}
        />

        <div className="right-col">
          <RightPanel
            state={state}
            onCompleteRandomQuest={completeRandomQuest}
          />
        </div>
      </div>

      {showAddModal && (
        <AddEntryModal
          onClose={() => setShowAddModal(false)}
          onAdd={(title, category, points) => {
            addEntry(title, category, points)
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
