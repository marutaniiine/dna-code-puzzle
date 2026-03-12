import { useState, useCallback, useEffect } from 'react'
import type { FC } from 'react'
import type { Stage } from '../data/codons'
import { AMINO_ACIDS, decodeSequence } from '../data/codons'
import './GameScreen.css'

interface Props {
  stage: Stage
  stageIndex: number
  total: number
  onClear: (id: number) => void
  onNext: () => void
  onBack: () => void
  onReference: () => void
}

type BaseChar = 'A' | 'T' | 'G' | 'C'

const BASE_COLOR: Record<BaseChar, string> = {
  A: 'var(--A)', T: 'var(--T)', G: 'var(--G)', C: 'var(--C)'
}

function splitCodons(seq: string): string[] {
  const out: string[] = []
  for (let i = 0; i + 2 < seq.length; i += 3) out.push(seq.slice(i, i + 3))
  return out
}

const GameScreen: FC<Props> = ({ stage, stageIndex, total, onClear, onNext, onBack, onReference }) => {
  const codons = splitCodons(stage.sequence)
  const correctAAs = decodeSequence(stage.sequence)

  const [answers, setAnswers] = useState<(string | null)[]>(codons.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showFact, setShowFact] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [wrongShake, setWrongShake] = useState(false)

  useEffect(() => {
    setAnswers(codons.map(() => null))
    setSubmitted(false)
    setShowHint(false)
    setShowFact(false)
    setCleared(false)
    setWrongShake(false)
  }, [stage.id])

  const handleSelect = useCallback((codonIdx: number, aa: string) => {
    if (submitted) return
    setAnswers(prev => prev.map((v, i) => i === codonIdx ? aa : v))
  }, [submitted])

  const handleSubmit = useCallback(() => {
    const allFilled = answers.every(a => a !== null)
    if (!allFilled) return
    setSubmitted(true)
    const correct = answers.every((a, i) => a === correctAAs[i])
    if (correct) {
      setCleared(true)
      onClear(stage.id)
      setShowFact(true)
    } else {
      setWrongShake(true)
      setTimeout(() => setWrongShake(false), 600)
    }
  }, [answers, correctAAs, onClear, stage.id])

  const handleRetry = () => {
    setAnswers(codons.map(() => null))
    setSubmitted(false)
  }

  // Available amino acid choices for each codon (correct + 3 distractors)
  const getChoices = (codonIdx: number): string[] => {
    const correct = correctAAs[codonIdx]
    const allAAs = Object.keys(AMINO_ACIDS)
    const distractors = allAAs.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
    return [correct, ...distractors].sort(() => Math.random() - 0.5)
  }

  const [choices] = useState(() => codons.map((_, i) => getChoices(i)))

  const allFilled = answers.every(a => a !== null)

  return (
    <div className="game-screen">
      <header className="gs-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← 戻る</button>
        <span className="gs-stage-label">Stage {stageIndex + 1} / {total}</span>
        <button className="btn btn-ghost btn-sm" onClick={onReference}>📋 コドン表</button>
      </header>

      <div className="gs-body">
        <h2 className="gs-title">{stage.title}</h2>
        <p className="gs-desc">{stage.description}</p>

        {/* DNA Sequence Display */}
        <div className="dna-display">
          <div className="dna-label">DNA配列</div>
          <div className="dna-seq">
            {codons.map((codon, ci) => (
              <div key={ci} className="codon-block">
                <div className="codon-bases">
                  {codon.split('').map((b, bi) => (
                    <span key={bi} className="base" style={{ color: BASE_COLOR[b as BaseChar] ?? '#fff' }}>{b}</span>
                  ))}
                </div>
                <div className="codon-arrow">↓</div>
                <div className={`codon-result ${submitted ? (answers[ci] === correctAAs[ci] ? 'correct' : 'wrong') : ''}`}>
                  {answers[ci]
                    ? <span style={{ color: AMINO_ACIDS[answers[ci]]?.color ?? '#fff' }}>{answers[ci]}</span>
                    : <span className="placeholder">?</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Choices per Codon */}
        {!submitted && (
          <div className="choices-area">
            {codons.map((codon, ci) => (
              <div key={ci} className="codon-choices">
                <div className="codon-label-sm">
                  {codon.split('').map((b, bi) => (
                    <span key={bi} style={{ color: BASE_COLOR[b as BaseChar] ?? '#fff' }}>{b}</span>
                  ))}
                </div>
                <div className="choice-buttons">
                  {choices[ci].map(aa => (
                    <button
                      key={aa}
                      className={`choice-btn ${answers[ci] === aa ? 'selected' : ''}`}
                      style={answers[ci] === aa ? { borderColor: AMINO_ACIDS[aa]?.color, background: `${AMINO_ACIDS[aa]?.color}22` } : {}}
                      onClick={() => handleSelect(ci, aa)}
                    >
                      <span className="choice-code" style={{ color: AMINO_ACIDS[aa]?.color }}>{aa}</span>
                      <span className="choice-name">{AMINO_ACIDS[aa]?.abbr}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {submitted && !cleared && (
          <div className={`result-wrong ${wrongShake ? 'shake' : ''}`}>
            <div className="result-icon">❌</div>
            <p>不正解！コドン表を確認してもう一度。</p>
            <div className="wrong-detail">
              {codons.map((codon, ci) => {
                const ok = answers[ci] === correctAAs[ci]
                return !ok ? (
                  <div key={ci} className="wrong-item">
                    <span className="wi-codon">{codon}</span>
                    <span className="wi-yours">あなた: {answers[ci]}</span>
                    <span className="wi-correct">正解: <strong>{correctAAs[ci]}</strong> ({AMINO_ACIDS[correctAAs[ci]]?.name})</span>
                  </div>
                ) : null
              })}
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleRetry}>もう一度</button>
          </div>
        )}

        {cleared && (
          <div className="result-clear">
            <div className="result-icon">🎉</div>
            <h3>解読成功！</h3>
            <div className="aa-sequence">
              {correctAAs.map((aa, i) => (
                <div key={i} className="aa-chip" style={{ background: `${AMINO_ACIDS[aa]?.color}22`, borderColor: AMINO_ACIDS[aa]?.color }}>
                  <span style={{ color: AMINO_ACIDS[aa]?.color }}>{aa}</span>
                  <small>{AMINO_ACIDS[aa]?.abbr}</small>
                </div>
              ))}
            </div>
            {showFact && (
              <div className="fact-box">
                <span className="fact-label">🔬 DNA豆知識</span>
                <p>{stage.fact}</p>
              </div>
            )}
            <button className="btn btn-primary" onClick={onNext}>
              {stageIndex < total - 1 ? '次のステージへ →' : '🎓 全ステージクリア！'}
            </button>
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <div className="submit-area">
            {!showHint ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>💡 ヒント</button>
            ) : (
              <div className="hint-box">{stage.hint}</div>
            )}
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!allFilled}
              style={{ opacity: allFilled ? 1 : 0.5 }}
            >
              解読する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameScreen
