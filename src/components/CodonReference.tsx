import type { FC } from 'react'
import { CODON_TABLE, AMINO_ACIDS } from '../data/codons'
import './CodonReference.css'

interface Props { onBack: () => void }

const BASES = ['T', 'C', 'A', 'G']

const CodonReference: FC<Props> = ({ onBack }) => {
  return (
    <div className="ref-screen">
      <header className="ref-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← 戻る</button>
        <h2>コドン表（遺伝暗号表）</h2>
        <div />
      </header>
      <div className="ref-body">
        <p className="ref-desc">3塩基（コドン）がどのアミノ酸をコードするか一覧表。DNAではU→T。</p>
        <div className="codon-table">
          <div className="ct-header">
            <div className="ct-cell ct-head">1文字目</div>
            {BASES.map(b2 => <div key={b2} className="ct-cell ct-head">2文字目: {b2}</div>)}
            <div className="ct-cell ct-head">3文字目</div>
          </div>
          {BASES.map(b1 => (
            BASES.map((b3, b3i) => (
              <div key={`${b1}-${b3}`} className="ct-row">
                {b3i === 0 && <div className="ct-cell ct-b1 ct-rowspan" style={{ gridRow: `span 4` }}>{b1}</div>}
                {BASES.map(b2 => {
                  const codon = `${b1}${b2}${b3}`
                  const aa = CODON_TABLE[codon]
                  const info = AMINO_ACIDS[aa]
                  return (
                    <div key={b2} className="ct-cell ct-codon">
                      <span className="ct-codon-str">{codon}</span>
                      <span className="ct-aa" style={{ color: info?.color }}>{aa}</span>
                      <span className="ct-abbr">{info?.abbr}</span>
                    </div>
                  )
                })}
                <div className="ct-cell ct-b3">{b3}</div>
              </div>
            ))
          ))}
        </div>
        <div className="aa-legend">
          <h3>アミノ酸一覧</h3>
          <div className="aa-grid">
            {Object.values(AMINO_ACIDS).map(aa => (
              <div key={aa.code} className="aa-item" style={{ borderColor: aa.color }}>
                <span className="aa-code" style={{ color: aa.color }}>{aa.code}</span>
                <span className="aa-abbr3">{aa.abbr}</span>
                <span className="aa-name-jp">{aa.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodonReference
