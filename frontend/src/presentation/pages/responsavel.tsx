import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PerfilResponsavel() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    // Carrega Tailwind e configuração
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(tailwindScript)

    const configScript = document.createElement('script')
    configScript.src = '/tailwind-config.js'
    document.head.appendChild(configScript)

    carregarPerfil()

    return () => {
      document.head.removeChild(tailwindScript)
      document.head.removeChild(configScript)
    }
  }, [])

  const carregarPerfil = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:3001/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        const user = data.data
        setNome(user.name)
        setEmail(user.email)
        setAvatar(user.avatar || '')
      } else {
        setErro('Não foi possível carregar o perfil.')
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.')
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso(false)

    if (!nome.trim()) {
      setErro('O nome não pode ficar em branco.')
      return
    }

    setSalvando(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nome, avatar }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.error?.message || 'Erro ao salvar.')
        return
      }

      // Atualiza o nome no localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        user.name = nome
        user.avatar = avatar
        localStorage.setItem('user', JSON.stringify(user))
      }

      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (error) {
      setErro('Erro de conexão com o servidor.')
      console.error(error)
    } finally {
      setSalvando(false)
    }
  }

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">
      {/* Fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float" alt="" />
        ))}
        <img
          src="/imagem/Montanha.svg"
          className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover"
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
      <main className="relative z-10 w-[85%] md:w-full max-w-[650px] mx-auto mt-6 flex-1 flex flex-col mb-10">
        <div className="bg-brand-cardBg rounded-[40px] px-6 md:px-12 py-10 shadow-xl border-[3px] border-[#D6E2C6]/50">
          <h2 className="text-3xl md:text-4xl text-brand-btnBg font-bold text-center mb-8">
            Meu Perfil
          </h2>

          {carregando ? (
            <p className="text-center text-xl text-brand-textDark">Carregando...</p>
          ) : erro && !sucesso ? (
            <p className="text-red-500 text-center bg-red-100 p-3 rounded-xl font-medium">{erro}</p>
          ) : (
            <form onSubmit={handleSalvar} className="flex flex-col items-center gap-6">
              {/* Avatar atual */}
              <div className="w-[120px] h-[120px] bg-white rounded-full border-[4px] border-brand-btnBorder flex items-center justify-center overflow-hidden shadow-md">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>

              <div className="w-full space-y-4">
                <div>
                  <label className="block text-brand-textDark font-bold text-lg mb-1 ml-2">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-brand-inputBg border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-brand-textDark font-bold text-lg mb-1 ml-2">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-200 border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-gray-500 cursor-not-allowed shadow-inner text-lg font-medium"
                  />
                  <p className="text-sm text-brand-textDark/60 mt-1 ml-2">O e-mail não pode ser alterado.</p>
                </div>
              </div>

              {sucesso && (
                <p className="text-green-600 text-center bg-green-100 p-3 rounded-xl font-medium w-full">
                  Perfil atualizado com sucesso!
                </p>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="bg-brand-btnBg text-[#E3F4B9] border-[2px] border-brand-btnBorder rounded-full px-12 py-3 text-xl font-bold hover:bg-[#7da02b] transition-colors shadow-[0px_4px_0px_rgba(93,125,14,0.3)] active:shadow-none active:translate-y-1 disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}