import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Question {
  id: number
  question: string
  options: { text: string; correct: boolean }[]
  color: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Qual é a cor do Sol? ☀️",
    options: [
      { text: "Azul", correct: false },
      { text: "Verde", correct: false },
      { text: "Amarelo", correct: true },
      { text: "Rosa", correct: false }
    ],
    color: "bg-yellow-400"
  },
  {
    id: 2,
    question: "Quanto é 1 + 1? 🍎+🍎",
    options: [
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "3", correct: false },
      { text: "4", correct: false }
    ],
    color: "bg-red-400"
  },
  {
    id: 3,
    question: "Qual desses animais faz 'Muuu'? 🐮",
    options: [
      { text: "Gato", correct: false },
      { text: "Cachorro", correct: false },
      { text: "Vaca", correct: true },
      { text: "Passarinho", correct: false }
    ],
    color: "bg-green-400"
  },
  {
    id: 4,
    question: "Qual fruta é vermelha e tem sementes por fora? 🍓",
    options: [
      { text: "Banana", correct: false },
      { text: "Uva", correct: false },
      { text: "Morango", correct: true },
      { text: "Laranja", correct: false }
    ],
    color: "bg-pink-400"
  }
]

export default function QuizGame() {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const playSound = (type: 'acerto' | 'erro' | 'parabens-song' | 'ploc') => {
    const audio = new Audio(`/jogos/som/${type}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const handleOptionClick = (index: number, isCorrect: boolean) => {
    if (isAnswered) return
    
    setSelectedOption(index)
    setIsAnswered(true)
    
    if (isCorrect) {
      setScore(s => s + 1)
      playSound('acerto')
    } else {
      playSound('erro')
    }

    setTimeout(async () => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(i => i + 1)
        setIsAnswered(false)
        setSelectedOption(null)
      } else {
        playSound('parabens-song')
        setShowWinModal(true)
        
        // SALVAR PONTUAÇÃO NO BACKEND
        const { saveScore } = await import('../../utils/api')
        await saveScore('aprender', score * 10 + 20) // Pontos base + bônus
      }
    }, 1500)
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background Assets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img src="/imagem/Montanha.svg" className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90" alt="" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/catalogo/aprender')}
          className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Quiz KidQuest</h1>
        <div className="w-24"></div>
      </header>

      {/* Game Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[50px] border border-white/30 shadow-2xl flex flex-col items-center max-w-2xl w-full">
          
          <div className="w-full flex justify-between items-center mb-6">
            <span className="bg-white px-4 py-1 rounded-full text-brand-btnBg font-bold">Pergunta {currentQuestionIndex + 1} / {QUESTIONS.length}</span>
            <span className="bg-brand-btnBg text-white px-4 py-1 rounded-full font-bold">Acertos: {score}</span>
          </div>

          <div className={`w-full p-8 rounded-[40px] ${currentQuestion.color} border-8 border-white shadow-xl mb-8 animate-pop-in`}>
            <h2 className="text-3xl md:text-4xl font-black text-white text-center drop-shadow-md">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index, option.correct)}
                disabled={isAnswered}
                className={`
                  py-5 px-6 rounded-3xl text-xl md:text-2xl font-black transition-all shadow-lg
                  ${isAnswered 
                    ? (option.correct ? 'bg-green-400 text-white shadow-[0_6px_0_#166534]' : (selectedOption === index ? 'bg-red-400 text-white shadow-[0_6px_0_#991b1b] animate-shake' : 'bg-white text-gray-300'))
                    : 'bg-white text-brand-textDark hover:scale-105 hover:bg-gray-50 shadow-[0_6px_0_#d1d5db]'
                  }
                `}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">⭐</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">GENIAL!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você acertou {score} perguntas!</p>
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
        @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes bounce-in { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  )
}
