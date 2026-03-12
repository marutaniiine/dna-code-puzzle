// Standard genetic code: codon -> amino acid (1-letter code + full name)
export interface AminoAcid {
  code: string    // 1-letter
  name: string    // full name (Japanese)
  abbr: string    // 3-letter
  color: string
}

export const AMINO_ACIDS: Record<string, AminoAcid> = {
  F: { code: 'F', name: 'フェニルアラニン', abbr: 'Phe', color: '#f59e0b' },
  L: { code: 'L', name: 'ロイシン',         abbr: 'Leu', color: '#10b981' },
  I: { code: 'I', name: 'イソロイシン',     abbr: 'Ile', color: '#3b82f6' },
  M: { code: 'M', name: 'メチオニン',       abbr: 'Met', color: '#8b5cf6' },
  V: { code: 'V', name: 'バリン',           abbr: 'Val', color: '#ec4899' },
  S: { code: 'S', name: 'セリン',           abbr: 'Ser', color: '#06b6d4' },
  P: { code: 'P', name: 'プロリン',         abbr: 'Pro', color: '#f97316' },
  T: { code: 'T', name: 'トレオニン',       abbr: 'Thr', color: '#84cc16' },
  A: { code: 'A', name: 'アラニン',         abbr: 'Ala', color: '#eab308' },
  Y: { code: 'Y', name: 'チロシン',         abbr: 'Tyr', color: '#e11d48' },
  H: { code: 'H', name: 'ヒスチジン',       abbr: 'His', color: '#0ea5e9' },
  Q: { code: 'Q', name: 'グルタミン',       abbr: 'Gln', color: '#a855f7' },
  N: { code: 'N', name: 'アスパラギン',     abbr: 'Asn', color: '#14b8a6' },
  K: { code: 'K', name: 'リシン',           abbr: 'Lys', color: '#f43f5e' },
  D: { code: 'D', name: 'アスパラギン酸',   abbr: 'Asp', color: '#22c55e' },
  E: { code: 'E', name: 'グルタミン酸',     abbr: 'Glu', color: '#ef4444' },
  C: { code: 'C', name: 'システイン',       abbr: 'Cys', color: '#f59e0b' },
  W: { code: 'W', name: 'トリプトファン',   abbr: 'Trp', color: '#6366f1' },
  R: { code: 'R', name: 'アルギニン',       abbr: 'Arg', color: '#2563eb' },
  G: { code: 'G', name: 'グリシン',         abbr: 'Gly', color: '#9ca3af' },
  '*': { code: '*', name: '終止コドン',     abbr: 'Stop', color: '#dc2626' },
}

// Full codon table (mRNA codons: U→T for DNA display)
export const CODON_TABLE: Record<string, string> = {
  TTT:'F', TTC:'F', TTA:'L', TTG:'L',
  CTT:'L', CTC:'L', CTA:'L', CTG:'L',
  ATT:'I', ATC:'I', ATA:'I', ATG:'M',
  GTT:'V', GTC:'V', GTA:'V', GTG:'V',
  TCT:'S', TCC:'S', TCA:'S', TCG:'S',
  CCT:'P', CCC:'P', CCA:'P', CCG:'P',
  ACT:'T', ACC:'T', ACA:'T', ACG:'T',
  GCT:'A', GCC:'A', GCA:'A', GCG:'A',
  TAT:'Y', TAC:'Y', TAA:'*', TAG:'*',
  CAT:'H', CAC:'H', CAA:'Q', CAG:'Q',
  AAT:'N', AAC:'N', AAA:'K', AAG:'K',
  GAT:'D', GAC:'D', GAA:'E', GAG:'E',
  TGT:'C', TGC:'C', TGA:'*', TGG:'W',
  CGT:'R', CGC:'R', CGA:'R', CGG:'R',
  AGT:'S', AGC:'S', AGA:'R', AGG:'R',
  GGT:'G', GGC:'G', GGA:'G', GGG:'G',
}

export function decodeSequence(dna: string): string[] {
  const result: string[] = []
  for (let i = 0; i + 2 < dna.length; i += 3) {
    const codon = dna.slice(i, i + 3)
    result.push(CODON_TABLE[codon] ?? '?')
  }
  return result
}

export interface Stage {
  id: number
  title: string
  description: string
  sequence: string       // DNA sequence (multiple of 3, starts ATG, ends with stop)
  hint: string
  fact: string
}

// Each sequence starts ATG (Met = start codon) and ends with a stop codon
export const STAGES: Stage[] = [
  {
    id: 1,
    title: 'はじめての解読',
    description: 'ATGから始まる短い配列を解読しよう。ATGはメチオニン（開始コドン）だ。',
    sequence: 'ATGTTTTAA',
    hint: 'ATG→Met, TTT→Phe, TAA→Stop',
    fact: 'ATGは全てのタンパク質の開始シグナル。すべてのタンパク質はメチオニンから始まる！',
  },
  {
    id: 2,
    title: '4コドン解読',
    description: '4つのコドンを読んで、アミノ酸配列を答えよう。',
    sequence: 'ATGGGTAAATGA',
    hint: 'ATG→M, GGT→G, AAA→K, TGA→Stop',
    fact: 'GGTはグリシン。最も小さなアミノ酸で、タンパク質の折りたたみに重要な役割を持つ。',
  },
  {
    id: 3,
    title: 'ロイシンの謎',
    description: 'ロイシン(L)は6種類のコドンを持つ。どのコドンがロイシンか？',
    sequence: 'ATGTTACTGGAATAA',
    hint: 'TTA, CTG はどちらもロイシン！',
    fact: 'ロイシンは最も多くのコドン（6つ）を持つアミノ酸。遺伝暗号の縮退性と呼ばれる現象だ。',
  },
  {
    id: 4,
    title: '5コドン挑戦',
    description: '少し長くなった。落ち着いて3塩基ずつ区切ろう。',
    sequence: 'ATGCGTGATGAGTAA',
    hint: 'ATG→M, CGT→R, GAT→D, GAG→E, TAA→Stop',
    fact: 'アルギニン(R)は正電荷を持つ塩基性アミノ酸。DNA結合タンパク質によく含まれる。',
  },
  {
    id: 5,
    title: '終止コドンを見つけろ',
    description: 'TAA, TAG, TGAの3つが終止コドン。どこで翻訳が止まるか探せ。',
    sequence: 'ATGTTTCGTTGGGAG',
    hint: 'TGGはトリプトファン！TGAと混同しないように。',
    fact: 'TGGはトリプトファン唯一のコドン。体内で生成できない必須アミノ酸で、睡眠ホルモン「メラトニン」の原料。',
  },
  {
    id: 6,
    title: '6コドン解読',
    description: 'コドン表なしで解読できるか？記憶力を試せ。',
    sequence: 'ATGCCAACTTCGGAATAA',
    hint: 'CCA→P, ACT→T, TCG→S, GAA→E',
    fact: 'プロリン(P)は側鎖が環状構造。タンパク質の折れ曲がりポイントに多く見られる特殊なアミノ酸。',
  },
  {
    id: 7,
    title: 'システインの橋',
    description: 'CysはS-S結合でタンパク質を安定化する。TGTとTGCに注目。',
    sequence: 'ATGTGTAAATGCTGA',
    hint: 'TGT→C, TGC→C。どちらもシステイン！',
    fact: 'システイン同士のジスルフィド結合(S-S)はタンパク質の3D構造を固定する。髪の毛のパーマもこの結合を使っている！',
  },
  {
    id: 8,
    title: '7コドン',
    description: 'ここまで来たらコドン表なしで解けるはず。集中力勝負。',
    sequence: 'ATGAAACATTATGGTCATTAA',
    hint: 'AAA→K, CAT→H, TAT→Y, GGT→G, CAT→H',
    fact: 'ヒスチジン(H)はpHに応じて電荷が変わる唯一のアミノ酸。酵素の活性中心によく現れる。',
  },
  {
    id: 9,
    title: '隠されたメッセージ',
    description: 'このDNA配列にはある単語が隠されている。解読して見つけよう。',
    sequence: 'ATGGAGAAGGAGTAA',
    hint: 'EKE...なんの略？',
    fact: '"EKE"というアミノ酸略称は…特に意味はないが、こうして任意の配列を「設計」できるのがDNAの奥深さ！',
  },
  {
    id: 10,
    title: '最終解読：完全配列',
    description: 'コドン表マスター最終試験。10コドンを全て正確に解読せよ。',
    sequence: 'ATGCGTCATGGTGAAGCTTTTAAGTAA',
    hint: 'CGT→R, CAT→H, GGT→G, GAA→E, GCT→A, TTT→F, AAG→K',
    fact: 'これで全20種類のアミノ酸とコドン表の基礎をマスター！実際のゲノムではこのような配列が何万個も連なって生命が生まれる。',
  },
]
