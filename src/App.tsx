import { useState } from 'react'
import type { FC } from 'react'
import './App.css'
import { STAGES } from './data/codons'
import GameScreen from './components/GameScreen'
import CodonReference from './components/CodonReference'

type View = 'title' | 'game' | 'reference'

const App: FC = () => {
  const [view, setView] = useState<View>('title')
  const [stageIndex, setStageIndex] = useState(0)
  const [clearedStages, setClearedStages] = useState<Set<number>>(new Set())

  const handleClear = (id: number) => {
    setClearedStages(prev => new Set([...prev, id]))
  }

  const handleNext = () => {
    if (stageIndex < STAGES.length - 1) setStageIndex(i => i + 1)
    else setView('title')
  }

  return (
    <div className="app">
      {view === 'title' && (
        <TitleScreen
          clearedCount={clearedStages.size}
          total={STAGES.length}
          onStart={() => { setStageIndex(0); setView('game') }}
          onContinue={() => setView('game')}
          onReference={() => setView('reference')}
          stages={STAGES}
          clearedStages={clearedStages}
          onSelectStage={(i) => { setStageIndex(i); setView('game') }}
        />
      )}
      {view === 'game' && (
        <GameScreen
          stage={STAGES[stageIndex]}
          stageIndex={stageIndex}
          total={STAGES.length}
          onClear={handleClear}
          onNext={handleNext}
          onBack={() => setView('title')}
          onReference={() => setView('reference')}
        />
      )}
      {view === 'reference' && (
        <CodonReference onBack={() => setView(stageIndex >= 0 ? 'game' : 'title')} />
      )}
    </div>
  )
}

interface TitleProps {
  clearedCount: number
  total: number
  onStart: () => void
  onContinue: () => void
  onReference: () => void
  stages: typeof STAGES
  clearedStages: Set<number>
  onSelectStage: (i: number) => void
}

const TitleScreen: FC<TitleProps> = ({ clearedCount, total, onStart, onReference, stages, clearedStages, onSelectStage }) => (
  <div className="title-screen">
    <div className="dna-bg">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="dna-strand" style={{ left: `${10 + i * 12}%`, animationDelay: `${i * 0.3}s` }} />
      ))}
    </div>
    <div className="title-content">
      <div className="title-icon">🧬</div>
      <h1>DNA暗号解読パズル</h1>
      <p className="title-sub">遺伝暗号を読んでアミノ酸配列を解読しよう</p>
      <div className="title-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(clearedCount / total) * 100}%` }} />
        </div>
        <span>{clearedCount} / {total} ステージクリア</span>
      </div>
      <div className="title-buttons">
        <button className="btn btn-primary" onClick={onStart}>
          {clearedCount === 0 ? '▶ はじめる' : '▶ 最初から'}
        </button>
        <button className="btn btn-secondary" onClick={onReference}>
          📋 コドン表を見る
        </button>
      </div>
      <div className="stage-grid-title">
        {stages.map((s, i) => (
          <button
            key={s.id}
            className={`stage-chip ${clearedStages.has(s.id) ? 'cleared' : ''}`}
            onClick={() => onSelectStage(i)}
          >
            {clearedStages.has(s.id) ? '✓' : s.id}
          </button>
        ))}
      </div>
    </div>
  </div>
)

export default App
