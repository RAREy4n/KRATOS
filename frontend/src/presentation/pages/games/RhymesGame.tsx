import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Rhyme {
  word: string
  emoji: string
  rhymesWith: { word: string; emoji: string }
  options: { word: string; emoji: string }[]
}

const RHYMES: Rhyme[] = [
  { 
    word: 'Mão', emoji: '🖐️', 
    rhymesWith: { word: 'Pão', emoji: '🍞' },
    options: [{ word: 'Pão', emoji: '🍞' }, { word: 'Gato', emoji: '🐱' }, { word: 'Bola', emoji: '⚽' }]
  },
  { 
    word: 'Gato', emoji: '🐱', 
    rhymesWith: { word: 'Rato', emoji: '🐭' },
    options: [{ word: 'Rato', emoji: '🐭' }, { word: 'Casa', emoji: '🏠' }, { word: 'Sol', emoji: '☀️' }]
  },
  { 
    word: 'Casa', emoji: '🏠', 
    rhymesWith: { word: 'Asa', emoji: '🪽' },
    options: [{ word: 'Asa', emoji: '🪽' }, { word: 'Flor', emoji: '🌸' }, { word: 'Céu', emoji: '☁️' }]
  }
]

export default function RhymesGame() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(RHYMES[0])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)

  const generateLevel = () => {
    const target = RHYMES[Math.floor(Math.random() * RHYMES.length)]
    setCurrent({ ...target, options: [...target.options].sort(() => Math.random() - 0.5) })
    setIsCorrect(null)
    setSelectedWord(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleClick = (word: string) => {
    if (isCorrect) return
    setSelectedWord(word)
    if (word === current.rhymesWith.word) {
      setIsCorrect(true)
      setScore(s => s + 1)
      const audio = new Audio('/jogos/som/acerto.mp3')
      audio.play().catch(() => {})
      setTimeout(() => {
        if (score < 2) generateLevel()
        else setShowWinModal(true)
      }, 1500)
    } else {
      setIsCorrect(false)
      const audio = new Audio('/jogos/som/erro.mp3')
      audio.play().catch(() => {})
      setTimeout(() => setIsCorrect(null), 1000)
    }
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => navigate('/catalogo/conversar')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Rimas Divertidas</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-2xl text-center">
          <p className="text-white text-2xl md:text-3xl font-black mb-8 drop-shadow-md">O que rima com <span className="underline">{current.word.toUpperCase()}</span>?</p>
          
          <div className="w-40 h-40 bg-white rounded-full shadow-xl flex flex-col items-center justify-center border-4 border-brand-btnBg mb-12">
            <span className="text-7xl">{current.emoji}</span>
            <span className="font-bold text-brand-textDark">{current.word}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {current.options.map((opt) => (
              <button
                key={opt.word}
                onClick={() => handleClick(opt.word)}
                className={`
                  p-6 rounded-[40px] bg-white flex flex-col items-center gap-2 transition-all shadow-lg
                  ${selectedWord === opt.word && isCorrect === true ? 'ring-8 ring-green-400' : 
                    selectedWord === opt.word && isCorrect === false ? 'ring-8 ring-red-400 animate-shake' : 
                    'hover:scale-110'}
                `}
              >
                <span className="text-6xl">{opt.emoji}</span>
                <span className="text-xl font-black text-brand-textDark">{opt.word.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🎶</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">POETA!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Suas rimas são maravilhosas!</p>
            <button onClick={() => navigate('/catalogo/conversar')} className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] transition-all">VOLTAR AO INÍCIO</button>
          </div>
        </div>
      )}
    </div>
  )
}
