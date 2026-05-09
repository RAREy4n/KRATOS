import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AVATARES } from '../components/avatares'

interface Skill {
  level: number
  xp: number
}

interface Jogador {
  id: string
  name: string
  age: number
  avatar: string | null
  totalPoints: number
  currentLevel: number
  skills?: {
    aprender: Skill
    conversar: Skill
    jogar: Skill
  }
}

export default function Relatorio() {
  const navigate = useNavigate()
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [carregando, setCarregando] = useState(true)
  const [jogadorSelecionado, setJogadorSelecionado] = useState<Jogador | null>(null)

  useEffect(() => {
    carregarJogadores()
  }, [])

  const carregarJogadores = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/children', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setJogadores(data.data)
        if (data.data.length > 0) setJogadorSelecionado(data.data[0])
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    } finally {
      setCarregando(false)
    }
  }

  const getInsight = (j: Jogador) => {
    if (!j.skills) return "Comece a jogar para ver a análise!"
    const { aprender, conversar, jogar } = j.skills
    const max = Math.max(aprender.level, conversar.level, jogar.level)
    
    if (max === aprender.level) return `${j.name} tem um raciocínio lógico incrível! ✨`
    if (max === conversar.level) return `${j.name} está se tornando um mestre da comunicação! 🗣️`
    return `${j.name} tem ótimos reflexos e coordenação! 🎮`
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img src="/imagem/Montanha.svg" className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90" alt="" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/escolha_perfil')}
          className="bg-white/40 text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/50 hover:bg-white/60 transition-all shadow-sm"
        >
          ← Voltar
        </button>
        <div className="animate-swing">
          <img src="/imagem/logo.png" alt="KidQuest Logo" className="h-16 md:h-24" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <button
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="text-brand-textDark/60 font-bold hover:text-red-500 transition-colors"
        >
          Sair do Painel
        </button>
      </header>

      <main className="relative z-10 w-full max-w-[1100px] mx-auto mt-6 flex-1 px-4 pb-10">
        <h2 className="text-4xl md:text-5xl text-white font-black text-center mb-8 drop-shadow-lg">
          Painel de Aprendizado 📊
        </h2>

        {carregando ? (
          <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar: Lista de Filhos */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-white/80 font-bold ml-2">Meus Pequenos</h3>
              {jogadores.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setJogadorSelecionado(j)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[30px] transition-all border-2 ${
                    jogadorSelecionado?.id === j.id 
                    ? 'bg-white border-brand-btnBg shadow-xl scale-105' 
                    : 'bg-white/40 border-transparent hover:bg-white/60'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-brand-btnBg overflow-hidden">
                    <img src={j.avatar || '/imagem/avatar-default.png'} alt={j.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-brand-textDark text-lg">{j.name}</p>
                    <p className="text-brand-textDark/60 text-sm font-bold">Nível Geral: {j.currentLevel}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Dashboard: Detalhes */}
            {jogadorSelecionado && (
              <div className="lg:col-span-8 bg-white/90 backdrop-blur-xl rounded-[50px] p-8 shadow-2xl border border-white/50 animate-pop-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                  <div className="text-center md:text-left">
                    <h4 className="text-3xl font-black text-brand-textDark">{jogadorSelecionado.name}</h4>
                    <p className="text-brand-btnBg font-bold text-lg">{jogadorSelecionado.totalPoints} Pontos Totais ⭐</p>
                  </div>
                  <div className="bg-brand-btnBg/10 px-6 py-3 rounded-2xl border-2 border-brand-btnBg/20">
                    <p className="text-brand-btnBg font-black text-center leading-tight">
                      ANÁLISE DO PROFESSOR ROBÔ:<br/>
                      <span className="text-brand-textDark font-medium">{getInsight(jogadorSelecionado)}</span>
                    </p>
                  </div>
                </div>

                {/* ÁREAS DE DESENVOLVIMENTO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['aprender', 'conversar', 'jogar'].map((area) => {
                    const skill = (jogadorSelecionado.skills as any)?.[area] || { level: 1, xp: 0 };
                    const colors = {
                      aprender: { bg: 'bg-yellow-100', bar: 'bg-yellow-400', text: 'text-yellow-700', icon: '✨' },
                      conversar: { bg: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-700', icon: '🗣️' },
                      jogar: { bg: 'bg-blue-100', bar: 'bg-blue-500', text: 'text-blue-700', icon: '🎮' }
                    }[area as 'aprender' | 'conversar' | 'jogar'];

                    return (
                      <div key={area} className={`${colors.bg} p-6 rounded-[40px] flex flex-col items-center border-4 border-white shadow-sm`}>
                        <span className="text-4xl mb-2">{colors.icon}</span>
                        <h5 className={`font-black uppercase text-sm mb-4 ${colors.text}`}>{area}</h5>
                        <div className="w-full bg-white/50 h-4 rounded-full overflow-hidden mb-2">
                          <div className={`${colors.bar} h-full transition-all`} style={{ width: `${(skill.level / 5) * 100}%` }} />
                        </div>
                        <p className={`font-black ${colors.text}`}>Nível {skill.level} / 5</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-10 p-6 bg-brand-btnBg text-white rounded-[30px] flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🚀</span>
                    <div>
                      <p className="font-black text-xl">Próximo Objetivo</p>
                      <p className="opacity-90 font-medium text-sm">Complete mais 5 jogos para chegar ao Nível {jogadorSelecionado.currentLevel + 1}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/')} className="bg-white text-brand-btnBg px-6 py-2 rounded-full font-black hover:scale-105 transition-all">JOGAR AGORA</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSoft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-float { animation: floatSoft 5s ease-in-out infinite; }
        @keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}} />
    </div>
  )
}