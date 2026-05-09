import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ColorOption {
  name: string
  hex: string
}

const PRIMARY_COLORS: ColorOption[] = [
  { name: 'Vermelho', hex: 'bg-red-500' },
  { name: 'Amarelo', hex: 'bg-yellow-400' },
  { name: 'Azul', hex: 'bg-blue-500' }
]

const RECIPES = [
  { c1: 'Vermelho', c2: 'Amarelo', result: 'Laranja', resultHex: 'bg-orange-500' },
  { c1: 'Azul', c2: 'Amarelo', result: 'Verde', resultHex: 'bg-green-500' },
  { c1: 'Vermelho', c2: 'Azul', result: 'Roxo', resultHex: 'bg-purple-600' }
]

export default function ColorMixGame() {
  const navigate = useNavigate()
  const [target, setTarget] = useState(RECIPES[0])
  const [selection, setSelection] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showWinModal, setShowWinModal] = useState(false)
  const [score, setScore] = useState(0)

  const generateLevel = () => {
    const next = RECIPES[Math.floor(Math.random() * RECIPES.length)]
    setTarget(next)
    setSelection([])
    setIsCorrect(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleColorClick = (colorName: string) => {
    if (selection.length >= 2 || isCorrect) return
    
    const newSelection = [...selection, colorName]
    setSelection(newSelection)

    if (newSelection.length === 2) {
      const match = (
        (newSelection.includes(target.c1) && newSelection.includes(target.c2))
      )

      if (match) {
        setIsCorrect(true)
        setScore(s => s + 1)
        const audio = new Audio('/jogos/som/acerto.mp3')
        audio.play().catch(() => {})
        
        setTimeout(() => {
          if (score < 2) {
            generateLevel()
          } else {
            setShowWinModal(true)
          }
        }, 2000)
      } else {
        setIsCorrect(false)
        const audio = new Audio('/jogos/som/erro.mp3')
        audio.play().catch(() => {})
        setTimeout(() => {
          setSelection([])
          setIsCorrect(null)
        }, 1500)
      }
    }
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
      </div>

      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => navigate('/catalogo/aprender')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Mistura de Cores</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-2xl text-center">
          
          <p className="text-white text-2xl md:text-3xl font-black mb-8 drop-shadow-md">
            Misture as cores para criar: <span className="underline">{target.result.toUpperCase()}</span>
          </p>

          <div className="flex items-center gap-6 mb-12">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-8 border-white shadow-lg flex items-center justify-center text-4xl ${selection[0] ? PRIMARY_COLORS.find(c => c.name === selection[0])?.hex : 'bg-white/20'}`}>
                {selection[0] ? '🧪' : '?'}
            </div>
            <span className="text-4xl text-white font-bold">+</span>
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-8 border-white shadow-lg flex items-center justify-center text-4xl ${selection[1] ? PRIMARY_COLORS.find(c => c.name === selection[1])?.hex : 'bg-white/20'}`}>
                {selection[1] ? '🧪' : '?'}
            </div>
            <span className="text-4xl text-white font-bold">=</span>
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-8 border-white shadow-2xl flex items-center justify-center text-5xl ${isCorrect ? target.resultHex : 'bg-white/10'}`}>
                {isCorrect ? '✨' : '🎨'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full">
            {PRIMARY_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.name)}
                className={`
                  group flex flex-col items-center gap-3 transition-all
                  ${selection.includes(color.name) ? 'opacity-50 pointer-events-none' : 'hover:scale-110'}
                `}
              >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${color.hex} border-4 border-white shadow-lg flex items-center justify-center`}>
                    <span className="text-3xl group-hover:animate-bounce">🧪</span>
                </div>
                <span className="text-white font-bold text-lg">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🎨</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">ARTISTA!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você é mestre na mistura de cores!</p>
            <button onClick={() => navigate('/catalogo/aprender')} className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] transition-all">VOLTAR AO INÍCIO</button>
          </div>
        </div>
      )}
    </div>
  )
}
