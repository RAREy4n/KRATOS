
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  {
    id: '01',
    name: 'Eu...',
    items: ['Cheiro', 'Fala', 'Ouço', 'Penso', 'Sinto', 'Vejo']
  },
  {
    id: '02',
    name: 'Vou...',
    items: ['Calor', 'Sorvete', 'Pipa', 'Correr', 'Bicicleta', 'Quebra-Cabeça', 'Tocar', 'Pintar', 'Estudar', 'Brincar', 'Cantar', 'Pular', 'Basquete', 'Futebol', 'Video Game', 'Fruta', 'Música', 'Ler']
  },
  {
    id: '03',
    name: 'Com...',
    items: ['irmã', 'irmão', 'mãe', 'pai', 'vovó', 'vovô']
  },
  {
    id: '04',
    name: 'Estou...',
    items: ['bravo', 'feliz', 'impressionado', 'nervoso', 'nojo', 'triste']
  },
  {
    id: '05',
    name: 'Quero...',
    items: ['Pizza', 'Maçã', 'Ovo', 'Café', 'Geleia', 'Abacate', 'Chocolate', 'Brócolis', 'Melancia', 'Batata Frita', 'Refrigerante', 'Banana', 'Morango', 'Laranja', 'Uva', 'Abacaxi']
  }
]

export default function SentenceGame() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  const playSound = (item: string) => {
    const audio = new Audio(`/jogos/som/monta-frase/${item}.mp3`)
    audio.play().catch(e => console.log('Audio play failed', e))
  }

  useEffect(() => {
    // Estilos carregados localmente para melhor performance
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
        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">Montar Frases</h1>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-[1100px] mx-auto p-4 flex flex-col items-center">
        <p className="text-white text-2xl font-bold mb-8 text-center drop-shadow-md">
          Toque nas imagens para ouvir e montar suas frases! ✨
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white/20 backdrop-blur-md p-2 rounded-3xl border border-white/30">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-black text-lg transition-all ${activeCategory.id === cat.id ? 'bg-brand-btnBg text-white shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full overflow-y-auto max-h-[60vh] p-4 custom-scrollbar">
          {activeCategory.items.map((item) => (
            <button
              key={item}
              onClick={() => playSound(item)}
              className="group flex flex-col items-center animate-pop-in"
            >
              <div className="w-full aspect-square bg-white rounded-[35px] border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 group-hover:border-brand-btnBg transition-all mb-3 relative">
                <img 
                  src={`/jogos/images/monta_frase/${activeCategory.id}/${item}.jpg`} 
                  alt={item}
                  className="w-full h-full object-cover group-hover:brightness-110"
                />
              </div>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-brand-textDark font-black text-sm shadow-md group-hover:bg-brand-btnBg group-hover:text-white transition-all">
                {item.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}} />
    </div>
  )
}
