
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ABC_ITEMS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

export default function ABCGame() {
  const navigate = useNavigate()

  const playSound = (item: string) => {
    const audio = new Audio(`/jogos/som/abc/${item}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  useEffect(() => {
    // Carregamento nativo para performance otimizada
  }, [])

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
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">ABC & Números</h1>
        <div className="w-24"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-[1000px] mx-auto p-6 flex flex-col items-center">
        <p className="text-white text-2xl font-bold mb-8 text-center drop-shadow-md">
          Clique nas letras e números para ouvir! 🎵
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-4 w-full bg-white/20 backdrop-blur-md p-6 rounded-[40px] border border-white/30 shadow-2xl overflow-y-auto max-h-[70vh] custom-scrollbar">
          {ABC_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => playSound(item)}
              className="aspect-square bg-white rounded-2xl shadow-md border-4 border-white hover:scale-110 hover:border-green-300 active:scale-95 transition-all overflow-hidden group"
            >
              <img 
                src={`/jogos/images/abc/${item}.jpg`} 
                alt={item}
                className="w-full h-full object-cover group-hover:brightness-110"
              />
            </button>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}} />
    </div>
  )
}
