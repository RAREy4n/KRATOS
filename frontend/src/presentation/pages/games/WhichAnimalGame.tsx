
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Animal {
  id: string
  name: string
  options: string[]
}

const ANIMALS: Animal[] = [
  { id: 'pato', name: 'Pato', options: ['Gato', 'Pato', 'Vaca'] },
  { id: 'porco', name: 'Porco', options: ['Porco', 'Ovelha', 'Gato'] },
  { id: 'frango', name: 'Frango', options: ['Cavalo', 'Frango', 'Pato'] },
  { id: 'vaca', name: 'Vaca', options: ['Vaca', 'Bode', 'Coelho'] },
  { id: 'ovelha', name: 'Ovelha', options: ['Ovelha', 'Porco', 'Gato'] },
  { id: 'cavalo', name: 'Cavalo', options: ['Cavalo', 'Vaca', 'Frango'] },
  { id: 'coelho', name: 'Coelho', options: ['Coelho', 'Bode', 'Pato'] },
  { id: 'bode', name: 'Bode', options: ['Bode', 'Vaca', 'Gato'] },
  { id: 'gato', name: 'Gato', options: ['Gato', 'Pato', 'Coelho'] },
]

export default function WhichAnimalGame() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)

  const currentAnimal = ANIMALS[currentIndex]

  const playSound = (type: 'acerto' | 'erro' | 'parabens-song') => {
    const audio = new Audio(`/jogos/som/${type}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const handleOptionClick = (option: string) => {
    if (selectedOption) return
    
    setSelectedOption(option)
    if (option === currentAnimal.name) {
      setIsCorrect(true)
      setScore(s => s + 1)
      playSound('acerto')
      
      setTimeout(() => {
        if (currentIndex < ANIMALS.length - 1) {
          setCurrentIndex(c => c + 1)
          setSelectedOption(null)
          setIsCorrect(null)
        } else {
          playSound('parabens-song')
          setShowWinModal(true)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      playSound('erro')
      setTimeout(() => {
        setSelectedOption(null)
        setIsCorrect(null)
      }, 1000)
    }
  }

  useEffect(() => {
    // Estilos nativos ativos
  }, [])

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
        <button onClick={() => navigate('/')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all">← Voltar</button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Qual o Animal?</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center max-w-lg w-full">
          
          <div className="mb-8 w-64 h-64 rounded-[40px] overflow-hidden border-8 border-white shadow-xl bg-white">
            <img 
              src={`/jogos/images/qual_animal/${currentAnimal.id}.jpg`} 
              className="w-full h-full object-cover animate-pop-in" 
              key={currentAnimal.id}
              alt="Animal"
            />
          </div>

          <p className="text-white text-2xl font-black mb-6 drop-shadow-md text-center">
            Que animal é este?
          </p>

          <div className="flex flex-col gap-4 w-full">
            {currentAnimal.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`
                  py-4 rounded-2xl text-2xl font-black transition-all shadow-lg
                  ${selectedOption === option 
                    ? (option === currentAnimal.name ? 'bg-green-400 text-white shadow-[0_6px_0_#166534]' : 'bg-red-400 text-white shadow-[0_6px_0_#991b1b] animate-shake')
                    : 'bg-white text-brand-textDark hover:scale-105 hover:bg-brand-inputBg shadow-[0_6px_0_#d1d5db]'
                  }
                `}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-brand-cardBg/80 backdrop-blur-md px-8 py-3 rounded-full border border-white/30 shadow-xl">
          <p className="text-xl font-bold text-brand-textDark">Progresso: {currentIndex + 1} / {ANIMALS.length}</p>
        </div>
      </main>

      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🐾</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">INCRÍVEL!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você conhece todos os animais da fazenda!</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  )
}
