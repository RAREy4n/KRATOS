import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Emotion {
  id: string
  name: string
  emoji: string
  color: string
}

const EMOTIONS: Emotion[] = [
  { id: 'feliz', name: 'Feliz', emoji: '😊', color: 'bg-yellow-400' },
  { id: 'triste', name: 'Triste', emoji: '😢', color: 'bg-blue-400' },
  { id: 'bravo', name: 'Bravo', emoji: '😠', color: 'bg-red-500' },
  { id: 'surpreso', name: 'Surpreso', emoji: '😲', color: 'bg-purple-400' },
  { id: 'nojo', name: 'Nojo', emoji: '🤢', color: 'bg-green-500' },
  { id: 'medo', name: 'Medo', emoji: '😨', color: 'bg-gray-400' }
]

export default function EmotionsGame() {
  const navigate = useNavigate()
  const [targetEmotion, setTargetEmotion] = useState<Emotion>(EMOTIONS[0])
  const [options, setOptions] = useState<Emotion[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)

  const playSound = (type: 'acerto' | 'erro' | 'parabens-song' | 'ploc') => {
    const audio = new Audio(`/jogos/som/${type}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const generateLevel = () => {
    const target = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
    setTargetEmotion(target)

    let opts = [target]
    while (opts.length < 3) {
      const wrong = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
      if (!opts.find(o => o.id === wrong.id)) opts.push(wrong)
    }
    setOptions(opts.sort(() => Math.random() - 0.5))
    setIsAnswered(false)
    setSelectedId(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleOptionClick = (emotion: Emotion) => {
    if (isAnswered) return
    setSelectedId(emotion.id)
    setIsAnswered(true)

    if (emotion.id === targetEmotion.id) {
      setScore(s => s + 1)
      playSound('acerto')
      setTimeout(() => {
        if (score < 5) {
          generateLevel()
        } else {
          playSound('parabens-song')
          setShowWinModal(true)
        }
      }, 1500)
    } else {
      playSound('erro')
      setTimeout(() => {
        setIsAnswered(false)
        setSelectedId(null)
      }, 1000)
    }
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img src="/imagem/Montanha.svg" className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90" alt="" />
      </div>

      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => navigate('/catalogo/conversar')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Dicionário de Emoções</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-2xl text-center">
          
          <p className="text-white text-2xl md:text-3xl font-black mb-10 drop-shadow-md">
            Como o nosso robô está se sentindo?
          </p>

          {/* Emoji Grande Animado */}
          <div className={`w-48 h-48 md:w-64 md:h-64 rounded-[60px] ${targetEmotion.color} border-8 border-white shadow-2xl flex items-center justify-center text-8xl md:text-9xl mb-12 animate-pop-in relative`}>
            <div className="absolute -top-10 -right-10 bg-white text-brand-textDark text-6xl p-4 rounded-full shadow-lg border-4 border-brand-btnBg animate-swing">
                🤖
            </div>
            {targetEmotion.emoji}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {options.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleOptionClick(emotion)}
                disabled={isAnswered}
                className={`
                  py-6 rounded-3xl text-2xl font-black transition-all shadow-lg
                  ${isAnswered && emotion.id === targetEmotion.id ? 'bg-green-400 text-white shadow-[0_6px_0_#166534]' : 
                    isAnswered && selectedId === emotion.id ? 'bg-red-400 text-white shadow-[0_6px_0_#991b1b] animate-shake' : 
                    'bg-white text-brand-textDark hover:scale-105 shadow-[0_6px_0_#d1d5db]'}
                `}
              >
                {emotion.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🌈</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">MUITO BEM!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você conhece muito bem os sentimentos!</p>
            <button
              onClick={() => navigate('/catalogo/conversar')}
              className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes bounce-in { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        @keyframes swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }
        .animate-swing { animation: swing 3s ease-in-out infinite; }
      `}} />
    </div>
  )
}
