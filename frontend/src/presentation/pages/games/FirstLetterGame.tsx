import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Level {
  image: string
  word: string
  letter: string
}

const LEVELS: Level[] = [
  { image: '🍎', word: 'Maçã', letter: 'M' },
  { image: '🐶', word: 'Cachorro', letter: 'C' },
  { image: '⚽', word: 'Bola', letter: 'B' },
  { image: '🏠', word: 'Casa', letter: 'C' },
  { image: '🦒', word: 'Girafa', letter: 'G' },
  { image: '🐘', word: 'Elefante', letter: 'E' }
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function FirstLetterGame() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(LEVELS[0])
  const [options, setOptions] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)

  const generateLevel = () => {
    const target = LEVELS[Math.floor(Math.random() * LEVELS.length)]
    setCurrent(target)
    
    let opts = [target.letter]
    while (opts.length < 4) {
      const rand = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
      if (!opts.includes(rand)) opts.push(rand)
    }
    setOptions(opts.sort(() => Math.random() - 0.5))
    setIsCorrect(null)
    setSelectedLetter(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleClick = (letter: string) => {
    if (isCorrect) return
    setSelectedLetter(letter)
    if (letter === current.letter) {
      setIsCorrect(true)
      setScore(s => s + 1)
      const audio = new Audio('/jogos/som/acerto.mp3')
      audio.play().catch(() => {})
      setTimeout(() => {
        if (score < 4) generateLevel()
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
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Primeira Letra</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-2xl text-center">
          <p className="text-white text-2xl md:text-3xl font-black mb-8 drop-shadow-md">Com qual letra começa?</p>
          
          <div className="w-48 h-48 bg-white rounded-[40px] shadow-2xl flex items-center justify-center text-9xl mb-12 animate-pop-in border-8 border-brand-btnBg">
            {current.image}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {options.map((letter) => (
              <button
                key={letter}
                onClick={() => handleClick(letter)}
                className={`
                  py-6 rounded-3xl text-5xl font-black transition-all shadow-lg
                  ${selectedLetter === letter && isCorrect === true ? 'bg-green-400 text-white' : 
                    selectedLetter === letter && isCorrect === false ? 'bg-red-400 text-white animate-shake' : 
                    'bg-white text-brand-textDark hover:scale-105'}
                `}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">✍️</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">ESCRITOR!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você conhece todo o alfabeto!</p>
            <button onClick={() => navigate('/catalogo/conversar')} className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] transition-all">VOLTAR AO INÍCIO</button>
          </div>
        </div>
      )}
    </div>
  )
}
