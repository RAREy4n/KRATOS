import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CountingGame() {
  const navigate = useNavigate()
  const [targetCount, setTargetCount] = useState(0)
  const [apples, setApples] = useState<{ id: number; top: string; left: string }[]>([])
  const [options, setOptions] = useState<number[]>([])
  const [showWinModal, setShowWinModal] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const playSound = (type: 'acerto' | 'erro' | 'parabens-song' | 'ploc') => {
    const audio = new Audio(`/jogos/som/${type}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const generateLevel = () => {
    const count = Math.floor(Math.random() * 9) + 1 // 1 a 9
    setTargetCount(count)
    
    // Gerar posições aleatórias para as maçãs na copa da árvore
    const newApples = []
    for (let i = 0; i < count; i++) {
      newApples.push({
        id: i,
        top: `${Math.floor(Math.random() * 40) + 15}%`,
        left: `${Math.floor(Math.random() * 50) + 25}%`
      })
    }
    setApples(newApples)

    // Gerar opções de resposta
    let opts = [count]
    while (opts.length < 4) {
      const wrong = Math.floor(Math.random() * 9) + 1
      if (!opts.includes(wrong)) opts.push(wrong)
    }
    setOptions(opts.sort(() => Math.random() - 0.5))
    setIsAnswered(false)
    setSelectedOption(null)
  }

  useEffect(() => {
    generateLevel()
  }, [])

  const handleOptionClick = (num: number) => {
    if (isAnswered) return
    setSelectedOption(num)
    setIsAnswered(true)

    if (num === targetCount) {
      setScore(s => s + 1)
      playSound('acerto')
      setTimeout(() => {
        if (score < 4) {
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
        setSelectedOption(null)
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
        <button onClick={() => navigate('/catalogo/aprender')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Contando Frutinhas</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center w-full max-w-4xl h-[70vh] relative">
          
          <p className="text-white text-3xl font-black mb-4 drop-shadow-md text-center">
            Quantas maçãs você vê na árvore? 🍎
          </p>

          {/* Árvore e Maçãs */}
          <div className="relative flex-1 w-full flex justify-center items-center">
            {/* Tronco e Copa Simplificados com CSS */}
            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-green-500 rounded-full border-8 border-green-600 shadow-2xl relative overflow-hidden">
                {/* Textura da copa */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#fff_10%,_transparent_10%)] bg-[length:20px_20px]" />
                
                {/* Maçãs */}
                {apples.map((apple) => (
                    <div
                        key={apple.id}
                        className="absolute w-10 h-10 md:w-14 md:h-14 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pop-in flex items-center justify-center"
                        style={{ top: apple.top, left: apple.left }}
                    >
                        <div className="w-1 h-3 bg-green-800 absolute -top-2 rounded-full" />
                        <div className="w-3 h-3 bg-white/40 rounded-full absolute top-2 left-2" />
                    </div>
                ))}
            </div>
            {/* Tronco */}
            <div className="absolute bottom-[-20px] w-16 md:w-24 h-32 bg-amber-800 border-x-4 border-amber-950 -z-10" />
          </div>

          {/* Opções */}
          <div className="flex gap-4 mt-8">
            {options.map((num) => (
              <button
                key={num}
                onClick={() => handleOptionClick(num)}
                disabled={isAnswered}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-2xl text-3xl font-black transition-all shadow-xl
                  ${isAnswered && num === targetCount ? 'bg-green-400 text-white border-4 border-white' : 
                    isAnswered && selectedOption === num ? 'bg-red-400 text-white border-4 border-white animate-shake' : 
                    'bg-white text-brand-textDark hover:scale-110 active:scale-95 border-4 border-transparent'}
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🍎</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">COLHEITA FELIZ!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você sabe contar muito bem!</p>
            <button
              onClick={() => navigate('/catalogo/aprender')}
              className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop-in { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  )
}
