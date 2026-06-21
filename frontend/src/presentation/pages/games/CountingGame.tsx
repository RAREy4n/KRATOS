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
    audio.volume = 0.3
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const generateLevel = () => {
    const count = Math.floor(Math.random() * 9) + 1
    setTargetCount(count)

    const newApples = []
    for (let i = 0; i < count; i++) {
      newApples.push({
        id: i,
        top: `${Math.floor(Math.random() * 38) + 12}%`,
        left: `${Math.floor(Math.random() * 50) + 20}%`,
      })
    }
    setApples(newApples)

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
    <div className="bg-sky-gradient min-h-screen flex flex-col items-center overflow-hidden font-sans relative">

      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img
          src="/imagem/Montanha.svg"
          className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90"
          alt=""
        />
      </div>

      {/* Header compacto e responsivo */}
      <header className="relative z-10 w-full max-w-4xl px-3 pt-3 pb-1 flex justify-between items-center gap-2">
        <button
          onClick={() => navigate('/catalogo/aprender')}
          className="bg-white/30 backdrop-blur-md text-white rounded-full px-4 py-2 font-bold border border-white/40 hover:scale-105 transition-all text-sm md:text-base whitespace-nowrap flex-shrink-0"
        >
          ← Voltar
        </button>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow-lg text-center leading-tight">
          Contando Frutinhas
        </h1>
        {/* Placar */}
        <div className="bg-white/30 backdrop-blur-md rounded-full px-3 py-2 border border-white/40 flex-shrink-0">
          <span className="text-white font-black text-sm md:text-base">⭐ {score}/5</span>
        </div>
      </header>

      {/* Pergunta */}
      <div className="relative z-10 mt-2 px-4">
        <p className="text-white text-base sm:text-xl md:text-2xl font-black drop-shadow-md text-center bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
          Quantas maçãs você vê na árvore? 🍎
        </p>
      </div>

      {/* Área principal: árvore + botões */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 pb-4 gap-3">

        {/* Árvore responsiva */}
        <div className="relative flex justify-center items-end" style={{ width: 'min(55vw, 280px)', height: 'min(55vw, 280px)' }}>
          {/* Copa */}
          <div
            className="bg-green-500 rounded-full border-[6px] border-green-600 shadow-2xl relative overflow-hidden"
            style={{ width: 'min(55vw, 280px)', height: 'min(55vw, 280px)' }}
          >
            {/* Textura */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#fff_10%,_transparent_10%)] bg-[length:16px_16px]" />
            {/* Maçãs */}
            {apples.map((apple) => (
              <div
                key={apple.id}
                className="absolute bg-red-500 rounded-full border-[3px] border-white shadow-lg animate-pop-in flex items-center justify-center"
                style={{
                  top: apple.top,
                  left: apple.left,
                  width: 'min(9vw, 42px)',
                  height: 'min(9vw, 42px)',
                }}
              >
                <div className="w-[2px] h-[10px] bg-green-800 absolute -top-[6px] rounded-full" />
                <div className="w-[30%] h-[30%] bg-white/40 rounded-full absolute top-[20%] left-[20%]" />
              </div>
            ))}
          </div>
          {/* Tronco */}
          <div
            className="absolute bg-amber-800 border-x-4 border-amber-950"
            style={{
              bottom: 'min(-6vw, -28px)',
              width: 'min(11vw, 52px)',
              height: 'min(18vw, 90px)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Botões de resposta — touch targets grandes */}
        <div className="flex gap-3 sm:gap-5 mt-2 flex-wrap justify-center">
          {options.map((num) => (
            <button
              key={num}
              onClick={() => handleOptionClick(num)}
              disabled={isAnswered}
              className={`
                rounded-2xl font-black transition-all shadow-xl
                text-2xl sm:text-3xl
                active:scale-95
                ${isAnswered && num === targetCount
                  ? 'bg-green-400 text-white border-4 border-white scale-110'
                  : isAnswered && selectedOption === num
                  ? 'bg-red-400 text-white border-4 border-white animate-shake'
                  : 'bg-white text-brand-textDark hover:scale-110 border-4 border-transparent'}
              `}
              style={{ width: 'min(18vw, 72px)', height: 'min(18vw, 72px)' }}
            >
              {num}
            </button>
          ))}
        </div>
      </main>

      {/* Modal de vitória */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-8 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg w-full max-w-xs animate-bounce-in">
            <span className="text-7xl mb-3">🍎</span>
            <h2 className="text-3xl font-black text-brand-textDark mb-2">COLHEITA FELIZ!</h2>
            <p className="text-lg text-brand-textDark/80 mb-6 font-medium">Você sabe contar muito bem!</p>
            <button
              onClick={() => navigate('/catalogo/aprender')}
              className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-lg shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }

        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}} />
    </div>
  )
}
