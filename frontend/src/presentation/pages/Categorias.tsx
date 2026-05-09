import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Categorias() {
  const navigate = useNavigate()
  const [nomeJogador, setNomeJogador] = useState('Jogador')

  useEffect(() => {
    const child = localStorage.getItem('selectedChild')
    if (child) {
      try {
        const childData = JSON.parse(child)
        setNomeJogador(childData.name)
      } catch (e) {
        console.error("Erro ao carregar dados da criança", e)
      }
    }
  }, [])

  const categorias = [
    {
      id: 'aprender',
      titulo: 'Aprender',
      imagem: '/imagem/cat_aprender.png',
      cor: 'bg-[#FFEB3B]',
      borda: 'border-[#FBC02D]',
      texto: 'text-[#F57F17]'
    },
    {
      id: 'conversar',
      titulo: 'Conversar',
      imagem: '/imagem/cat_conversar.png',
      cor: 'bg-[#4CAF50]',
      borda: 'border-[#388E3C]',
      texto: 'text-[#1B5E20]'
    },
    {
      id: 'jogar',
      titulo: 'Jogar',
      imagem: '/imagem/cat_jogar.png',
      cor: 'bg-[#2196F3]',
      borda: 'border-[#1976D2]',
      texto: 'text-[#0D47A1]'
    }
  ]

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">
      
      {/* Nuvens e montanha */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
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
          className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover opacity-90"
          alt=""
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/escolha_perfil')}
          className="bg-white/40 text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/50 hover:bg-white/60 transition-all shadow-sm"
        >
          ← Mudar Jogador
        </button>
        <div className="animate-swing">
          <img src="/imagem/logo.png" alt="KidQuest Logo" className="h-20 md:h-28" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-[1200px] px-6 pb-20">
        <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-12 text-center">
          Vamos brincar, <span className="text-brand-btnBg underline decoration-white/30">{nomeJogador}</span>?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/catalogo/${cat.id}`)}
              className="group relative flex flex-col items-center"
            >
              <div className={`
                w-full aspect-square max-w-[320px] bg-white rounded-[50px] p-6
                border-[10px] border-white shadow-2xl transition-all duration-300
                group-hover:scale-105 group-hover:rotate-2
              `}>
                <img
                  src={cat.imagem}
                  alt={cat.titulo}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <span className={`
                mt-6 text-4xl md:text-5xl font-black ${cat.texto} drop-shadow-sm
                bg-white px-8 py-2 rounded-full border-4 border-white shadow-lg
                transition-all group-hover:-translate-y-2
              `}>
                {cat.titulo}
              </span>
            </button>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-float { animation: floatSoft 5s ease-in-out infinite; }
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        .animate-swing { animation: swing 3s ease-in-out infinite; transform-origin: top center; }
      `}} />
    </div>
  )
}
