
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Card {
  id: number
  fruit: string
  isFlipped: boolean
  isMatched: boolean
}

const FRUITS = [
  'abacaxi',
  'abacate',
  'laranja',
  'maca',
  'melancia',
  'uva',
]

export default function MemoryGame() {
  const navigate = useNavigate()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  // Audio refs
  const playSound = (type: 'acerto' | 'erro' | 'parabens' | 'ploc') => {
    const audio = new Audio(`/jogos/som/${type}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  const initializeGame = useCallback(() => {
    const duplicatedFruits = [...FRUITS, ...FRUITS]
    const shuffledCards = duplicatedFruits
      .sort(() => Math.random() - 0.5)
      .map((fruit, index) => ({
        id: index,
        fruit,
        isFlipped: false,
        isMatched: false,
      }))
    
    setCards(shuffledCards)
    setFlippedCards([])
    setMatches(0)
    setShowWinModal(false)
    setIsLocked(false)
  }, [])

  useEffect(() => {
    initializeGame()
    // Carregamento nativo de estilos para performance
  }, [initializeGame])

  const handleCardClick = (id: number) => {
    if (isLocked) return
    const card = cards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched || flippedCards.includes(id)) return

    playSound('ploc')
    
    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setIsLocked(true)
      const [firstId, secondId] = newFlipped
      const firstCard = cards.find(c => c.id === firstId)!
      const secondCard = cards.find(c => c.id === secondId)!

      if (firstCard.fruit === secondCard.fruit) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ))
          setFlippedCards([])
          setIsLocked(false)
          setMatches(m => {
            const newMatches = m + 1
            if (newMatches === FRUITS.length) {
              playSound('parabens-song')
              setShowWinModal(true)
            } else {
              playSound('acerto')
            }
            return newMatches
          })
        }, 600)
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
          setIsLocked(false)
          playSound('erro')
        }, 1000)
      }
    }
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background Assets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img
            key={i}
            src="/imagem/Nuvens.svg"
            className="animate-float opacity-70"
            alt=""
          />
        ))}
        <img
          src="/imagem/Montanha.svg"
          className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90"
          alt=""
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40 hover:scale-105 transition-all"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Jogo da Memória</h1>
        <div className="w-24"></div> {/* Spacer */}
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-[40px] border border-white/30 shadow-2xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-[800px]">
            {cards.map((card) => {
              const isFlipped = card.isFlipped || card.isMatched || flippedCards.includes(card.id)
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`relative w-24 h-24 sm:w-32 sm:h-32 cursor-pointer transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Face Front (Verso) */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-lg border-4 border-white/50">
                    <img src="/jogos/images/jogo_da_memoria/verso.jpg" className="w-full h-full object-cover" alt="Verso" />
                  </div>
                  
                  {/* Face Back (Fruta) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-lg border-4 border-green-300">
                    <img 
                      src={card.isMatched ? "/jogos/images/jogo_da_memoria/ok.jpg" : `/jogos/images/jogo_da_memoria/${card.fruit}.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={card.fruit} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 bg-brand-cardBg/80 backdrop-blur-md px-8 py-3 rounded-full border border-white/30 shadow-xl">
          <p className="text-xl font-bold text-brand-textDark">Pares encontrados: {matches} / {FRUITS.length}</p>
        </div>
      </main>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-brand-btnBg max-w-sm w-full animate-bounce-in">
            <span className="text-8xl mb-4">🏆</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">PARABÉNS!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você encontrou todos os pares!</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={initializeGame}
                className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
              >
                JOGAR NOVAMENTE
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-sky-400 text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#0284c7] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
              >
                VOLTAR AO INÍCIO
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  )
}
