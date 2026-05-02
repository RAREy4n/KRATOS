import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Jogador {
  id: string
  name: string
  age: number
  avatar: string | null
  totalPoints: number
  currentLevel: number
}

export default function Relatorio() {
  const navigate = useNavigate()
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Carregar Tailwind e config
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(tailwindScript)

    const configScript = document.createElement('script')
    configScript.src = '/tailwind-config.js'
    document.head.appendChild(configScript)

    carregarJogadores()

    return () => {
      document.head.removeChild(tailwindScript)
      document.head.removeChild(configScript)
    }
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
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    } finally {
      setCarregando(false)
    }
  }

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Ordenar por nível e pontos (ranking)
  const ranking = [...jogadores].sort((a, b) => {
    if (b.currentLevel !== a.currentLevel) return b.currentLevel - a.currentLevel
    return b.totalPoints - a.totalPoints
  })

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">

      {/* Fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <img
          src="/img/Nuvens2.svg"
          className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[130%] h-auto animate-[pulse_4s_ease-in-out_infinite]"
          alt=""
        />
        <img
          src="/img/montanha.svg"
          className="absolute bottom-0 w-full h-auto translate-y-[40%] object-cover"
          alt=""
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/escolha_perfil')}
          className="bg-white/50 text-brand-textDark rounded-full px-8 py-3 font-bold text-lg shadow-sm hover:bg-white/80 transition-all border-2 border-white/50"
        >
          ← Voltar
        </button>
        <button
          onClick={handleSair}
          className="bg-white/40 text-brand-textDark rounded-full px-8 py-3 font-bold text-lg shadow-sm hover:bg-white/70 transition-all border-2 border-white/50"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo */}
      <main className="relative z-10 w-full max-w-[800px] mx-auto mt-6 flex-1 flex flex-col mb-10 px-4">
        <div className="bg-brand-cardBg rounded-[40px] px-6 md:px-12 py-8 shadow-xl border-[3px] border-[#D6E2C6]/50">
          
          <h2 className="text-3xl md:text-4xl text-brand-btnBg font-bold text-center mb-6 drop-shadow-sm">
             Relatório dos Jogadores
          </h2>

          {carregando ? (
            <p className="text-center text-xl text-brand-textDark mt-10">Carregando...</p>
          ) : jogadores.length === 0 ? (
            <p className="text-center text-xl text-brand-textDark mt-10">
              Nenhum jogador cadastrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-brand-textDark text-lg">
                <thead>
                  <tr className="border-b-2 border-brand-inputBorder">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jogador</th>
                    <th className="py-3 px-4">Idade</th>
                    <th className="py-3 px-4">Nível</th>
                    <th className="py-3 px-4">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((jogador, index) => (
                    <tr key={jogador.id} className="border-b border-brand-inputBorder/50 hover:bg-white/30">
                      <td className="py-3 px-4 font-bold">{index + 1}º</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <span className="text-2xl">{jogador.avatar || '🐶'}</span>
                        {jogador.name}
                      </td>
                      <td className="py-3 px-4">{jogador.age} anos</td>
                      <td className="py-3 px-4">{jogador.currentLevel}</td>
                      <td className="py-3 px-4 font-bold">{jogador.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}