import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Shape {
  id: string
  name: string
  path: string
  color: string
}

const SHAPES: Shape[] = [
  { id: 'circulo', name: 'Círculo', path: 'M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z', color: 'text-red-500' },
  { id: 'quadrado', name: 'Quadrado', path: 'M3 3H21V21H3V3Z', color: 'text-blue-500' },
  { id: 'triangulo', name: 'Triângulo', path: 'M12 3L21 21H3L12 3Z', color: 'text-yellow-500' },
  { id: 'estrela', name: 'Estrela', path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z', color: 'text-purple-500' }
]

export default function ShapesGame() {
  const navigate = useNavigate()
  const [currentShape, setCurrentShape] = useState(SHAPES[0])
  const [options, setOptions] = useState<Shape[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)

  const generateLevel = () => {
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setCurrentShape(target)
    setOptions([...SHAPES].sort(() => Math.random() - 0.5))
    setIsCorrect(null)
    setSelectedId(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleShapeClick = (shape: Shape) => {
    if (isCorrect) return
    setSelectedId(shape.id)
    if (shape.id === currentShape.id) {
      setIsCorrect(true)
      setScore(s => s + 1)
      const audio = new Audio('/jogos/som/acerto.mp3')
      audio.play().catch(() => {})
      setTimeout(() => {
        if (score < 3) {
          generateLevel()
        } else {
          setShowWinModal(true)
        }
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
        <button onClick={() => navigate('/catalogo/aprender')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Formas Geométricas</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-2xl text-center">
          
          <p className="text-white text-2xl md:text-3xl font-black mb-10 drop-shadow-md">
            Encontre o <span className="underline">{currentShape.name.toUpperCase()}</span>!
          </p>

          <div className="w-48 h-48 bg-white/20 rounded-[40px] border-8 border-dashed border-white/50 flex items-center justify-center mb-12">
            <svg className="w-32 h-32 text-white/40" viewBox="0 0 24 24" fill="currentColor">
              <path d={currentShape.path} />
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
            {options.map((shape) => (
              <button
                key={shape.id}
                onClick={() => handleShapeClick(shape)}
                className={`
                  aspect-square bg-white rounded-3xl p-4 flex items-center justify-center transition-all shadow-lg
                  ${selectedId === shape.id && isCorrect === true ? 'ring-8 ring-green-400 scale-110' : 
                    selectedId === shape.id && isCorrect === false ? 'ring-8 ring-red-400 animate-shake' : 
                    'hover:scale-105'}
                `}
              >
                <svg className={`w-full h-full ${shape.color}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d={shape.path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">📐</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">ARQUITETO!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você conhece todas as formas!</p>
            <button onClick={() => navigate('/catalogo/aprender')} className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] transition-all">VOLTAR AO INÍCIO</button>
          </div>
        </div>
      )}
    </div>
  )
}
