import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface Jogo {
  id: string
  titulo: string
  descricao: string
  categoria: 'aprender' | 'conversar' | 'jogar'
  tipo: string
  idadeMin?: number
  idadeMax?: number
  icone: string
  path: string
}

const JOGOS: Jogo[] = [
  // APRENDER
  { id: 'quiz', titulo: 'Quiz KidQuest', descricao: 'Desafie seu conhecimento com perguntas divertidas!', categoria: 'aprender', tipo: 'conhecimento', idadeMin: 4, idadeMax: 8, icone: '💡', path: '/jogos/quiz' },
  { id: 'contagem', titulo: 'Contando Frutinhas', descricao: 'Quantas maçãs você consegue contar na árvore?', categoria: 'aprender', tipo: 'matemática', idadeMin: 3, idadeMax: 7, icone: '🍎', path: '/jogos/contagem' },
  { id: 'cores', titulo: 'Mistura de Cores', descricao: 'Seja um pequeno artista criando novas cores!', categoria: 'aprender', tipo: 'arte', idadeMin: 4, idadeMax: 8, icone: '🎨', path: '/jogos/cores' },
  { id: 'formas', titulo: 'Formas Geométricas', descricao: 'Você consegue encontrar as formas escondidas?', categoria: 'aprender', tipo: 'geometria', idadeMin: 3, idadeMax: 6, icone: '📐', path: '/jogos/formas' },
  
  // CONVERSAR
  { id: 'abc', titulo: 'ABC & Números', descricao: 'Aprenda o alfabeto e os números de forma divertida!', categoria: 'conversar', tipo: 'leitura', idadeMin: 3, idadeMax: 6, icone: '🔤', path: '/jogos/abc' },
  { id: 'frases', titulo: 'Montar Frases', descricao: 'Combine palavras e crie suas próprias histórias!', categoria: 'conversar', tipo: 'escrita', idadeMin: 5, idadeMax: 12, icone: '✍️', path: '/jogos/frases' },
  { id: 'emocoes', titulo: 'Dicionário de Emoções', descricao: 'Como nosso robô está se sentindo hoje?', categoria: 'conversar', tipo: 'social', idadeMin: 3, idadeMax: 8, icone: '😊', path: '/jogos/emocoes' },
  { id: 'letras', titulo: 'Primeira Letra', descricao: 'Descubra com qual letra as palavras começam!', categoria: 'conversar', tipo: 'alfabeto', idadeMin: 4, idadeMax: 7, icone: '🅰️', path: '/jogos/letras' },
  { id: 'rimas', titulo: 'Rimas Divertidas', descricao: 'Encontre as palavras que rimam e fazem música!', categoria: 'conversar', tipo: 'sons', idadeMin: 4, idadeMax: 8, icone: '🎶', path: '/jogos/rimas' },
  
  // JOGAR
  { id: 'memoria', titulo: 'Jogo da Memória', descricao: 'Desafie sua mente encontrando os pares de frutas!', categoria: 'jogar', tipo: 'memória', idadeMin: 4, idadeMax: 10, icone: '🧠', path: '/jogos/memoria' },
  { id: 'animais', titulo: 'Qual o Animal?', descricao: 'Você conhece todos os animais da fazenda?', categoria: 'jogar', tipo: 'lógica', idadeMin: 3, idadeMax: 8, icone: '🐮', path: '/jogos/animais' },
  { id: 'bolinhas', titulo: 'Pega-Bolinhas', descricao: 'Seja rápido para pegar todas as bolinhas coloridas!', categoria: 'jogar', tipo: 'reflexo', idadeMin: 3, idadeMax: 12, icone: '⚪', path: '/jogos/bolinhas' },
]

export default function CatalogoJogos() {
  const navigate = useNavigate()
  const { categoria } = useParams<{ categoria: string }>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedChild, setSelectedChild] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const child = localStorage.getItem('selectedChild')
    
    setIsLoggedIn(!!token)
    if (child) {
      try {
        setSelectedChild(JSON.parse(child))
      } catch (e) {
        console.error("Erro ao carregar criança", e)
      }
    }
  }, [])

  const handleJogar = (path: string) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (!selectedChild) {
      navigate('/escolha_perfil')
      return
    }
    navigate(path)
  }

  const handleSairPerfil = () => {
    localStorage.removeItem('selectedChild')
    setSelectedChild(null)
    navigate('/escolha_perfil')
  }

  const jogosFiltrados = JOGOS.filter(j => j.categoria === categoria)

  const TITULOS_CATEGORIA: Record<string, string> = {
    aprender: 'Sala de Aprender ✨',
    conversar: 'Sala de Conversar 🗣️',
    jogar: 'Sala de Jogar 🎮'
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img src="/imagem/Montanha.svg" className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover opacity-90" alt="" />
      </div>

      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/categorias')} className="bg-white/40 text-brand-textDark rounded-full px-5 py-2 font-bold border border-white/40 hover:bg-white/60 transition-all shadow-sm">← Voltar</button>
            <div className="animate-swing cursor-pointer" onClick={() => navigate('/categorias')}>
                <img src="/imagem/logo.png" alt="KidQuest Logo" className="h-16 md:h-24" style={{ mixBlendMode: 'multiply' }} />
            </div>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedChild && (
            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md rounded-full pl-2 pr-4 py-1 border border-white/40">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-btnBg overflow-hidden">
                <img src={selectedChild.avatar || '/imagem/avatar-default.png'} alt={selectedChild.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-brand-textDark font-bold hidden sm:inline">{selectedChild.name}</span>
              <button onClick={handleSairPerfil} className="text-xs bg-red-400 text-white px-2 py-1 rounded-lg hover:bg-red-500 transition-colors">Trocar</button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto mt-6 flex-1 px-4 md:px-10 pb-10">
        <h2 className="text-4xl md:text-5xl text-white font-black text-center mb-10 drop-shadow-lg">
          {TITULOS_CATEGORIA[categoria || ''] || 'Nossos Jogos ✨'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jogosFiltrados.map((jogo) => (
            <div key={jogo.id} className="group relative rounded-[40px] p-[2px] bg-gradient-to-br from-white/40 to-transparent hover:scale-[1.03] transition-all duration-300">
              <div className="bg-brand-cardBg/90 backdrop-blur-xl rounded-[38px] p-8 shadow-2xl border border-white/20 flex flex-col items-center text-center h-full relative">
                <div className="mb-6 w-24 h-24 bg-white/50 rounded-[30px] shadow-inner flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">{jogo.icone}</div>
                <h3 className="text-2xl font-extrabold text-brand-textDark mb-2">{jogo.titulo}</h3>
                <p className="text-brand-textDark opacity-80 mb-6 text-sm leading-relaxed">{jogo.descricao}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold text-brand-textDark shadow-sm">{jogo.idadeMin}–{jogo.idadeMax} anos</span>
                  <span className="bg-brand-btnBg/20 text-brand-btnBg px-3 py-1 rounded-full text-xs font-bold capitalize">{jogo.tipo}</span>
                </div>
                <button onClick={() => handleJogar(jogo.path)} className="w-full bg-brand-btnBg text-[#E3F4B9] rounded-full py-4 font-black text-xl shadow-lg hover:brightness-110 active:translate-y-1 transition-all z-20">
                  JOGAR AGORA
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSoft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-float { animation: floatSoft 5s ease-in-out infinite; }
        @keyframes swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(4deg); } 75% { transform: rotate(-4deg); } }
        .animate-swing { animation: swing 3s ease-in-out infinite; transform-origin: top center; }
      `}} />
    </div>
  )
}