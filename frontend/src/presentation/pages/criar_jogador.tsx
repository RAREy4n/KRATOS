import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconesDialog from '../components/icones_dialog'
import { AVATARES } from '../components/avatares'  // 👈 importando a lista de avatares

export default function AdicionarJogador() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [dialogAberto, setDialogAberto] = useState(false)

  useEffect(() => {
    // Carregamento nativo otimizado
  }, [])

  // 👇 funções de navegação usando AVATARES
  const avatarAnterior = () => {
    setAvatarIndex((prev) => (prev === 0 ? AVATARES.length - 1 : prev - 1))
  }

  const proximoAvatar = () => {
    setAvatarIndex((prev) => (prev === AVATARES.length - 1 ? 0 : prev + 1))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')

    if (!nome || !idade) {
      setErro('Preencha todos os campos!')
      return
    }

    setLoading(true)

    const token = localStorage.getItem('token')

    if (!token) {
      setErro('Você precisa fazer login primeiro!')
      navigate('/login')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nome,
          age: parseInt(idade),
          avatar: AVATARES[avatarIndex].src,     // 👈 usando AVATARES
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.error?.message || 'Erro ao criar jogador')
        return
      }

      console.log('Jogador criado:', data)
      navigate('/escolha_perfil')
    } catch (error) {
      setErro('Erro de conexão com o servidor')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Drawer mobile
  useEffect(() => {
    const hamburgerBtn = document.getElementById('hamburgerBtn')
    const closeDrawerBtn = document.getElementById('closeDrawerBtn')
    const mobileDrawer = document.getElementById('mobileDrawer')
    const drawerOverlay = document.getElementById('drawerOverlay')

    if (!hamburgerBtn || !closeDrawerBtn || !mobileDrawer || !drawerOverlay) return

    const openDrawer = () => {
      mobileDrawer.classList.remove('translate-x-full')
      drawerOverlay.classList.remove('opacity-0', 'pointer-events-none')
      drawerOverlay.classList.add('opacity-100', 'pointer-events-auto')
    }

    const closeDrawer = () => {
      mobileDrawer.classList.add('translate-x-full')
      drawerOverlay.classList.remove('opacity-100', 'pointer-events-auto')
      drawerOverlay.classList.add('opacity-0', 'pointer-events-none')
    }

    hamburgerBtn.addEventListener('click', openDrawer)
    closeDrawerBtn.addEventListener('click', closeDrawer)
    drawerOverlay.addEventListener('click', closeDrawer)

    return () => {
      hamburgerBtn.removeEventListener('click', openDrawer)
      closeDrawerBtn.removeEventListener('click', closeDrawer)
      drawerOverlay.removeEventListener('click', closeDrawer)
    }
  }, [])

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">
      {/* Nuvens e montanha */}
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
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 flex flex-row flex-wrap justify-between items-center md:items-start gap-5 md:gap-4 lg:gap-0">
        <button
          className="relative cursor-pointer hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full"
          onClick={() => navigate('/escolha_perfil')}
          aria-label="Voltar para escolha de perfil"
        >
          <div className="bg-[#F6FAE3] rounded-full pr-8 pl-16 py-3 shadow-md flex items-center border-[2px] border-white/40">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-gray-200 rounded-full border-[3px] border-white shadow-sm overflow-hidden flex items-center justify-center">
              <span className="text-[10px] text-gray-500 text-center leading-tight">
                Avatar<br />Resp.
              </span>
            </div>
            <span className="text-brand-btnBg font-bold text-lg md:text-xl lg:text-2xl ml-4 truncate drop-shadow-sm max-w-[160px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-none">
              Responsável
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate('/escolha_perfil')}
          className="hidden md:flex bg-white/50 text-brand-textDark rounded-full px-6 md:px-8 lg:px-10 py-2 md:py-3 font-bold text-[18px] lg:text-[20px] shadow-sm hover:bg-white/80 transition-all border-[1.5px] border-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/50 w-full sm:w-auto shrink-0 mt-2 md:mt-0"
        >
          Voltar
        </button>

        <button
          id="hamburgerBtn"
          className="flex md:hidden flex-col items-center justify-center w-14 h-14 bg-white/40 border-[2px] border-white/50 rounded-full shadow-sm hover:bg-white/70 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/50 shrink-0"
          aria-label="Abrir menu"
        >
          <div className="w-6 h-1 bg-brand-textDark mb-1 rounded-full"></div>
          <div className="w-6 h-1 bg-brand-textDark mb-1 rounded-full"></div>
          <div className="w-6 h-1 bg-brand-textDark rounded-full"></div>
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 w-[85%] md:w-full max-w-[850px] mx-auto mt-[4vh] flex-1 flex flex-col mb-10">
        <div className="bg-brand-cardBg rounded-[40px] md:rounded-[55px] px-5 md:px-12 py-10 shadow-xl border-[3px] border-[#D6E2C6]/50 flex flex-col">
          <h2 className="text-3xl md:text-4xl text-brand-btnBg font-bold text-center mb-6 md:mb-8 drop-shadow-sm">
            Registrando jogador
          </h2>
          <p className="text-center text-brand-textDark text-xl md:text-2xl font-bold mb-8">
            Preencha os dados do jogador:
          </p>

          <form id="createPlayerForm" onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-center">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative w-[150px] h-[150px] md:w-[180px] md:h-[180px] bg-white rounded-full shadow-inner border-[4px] border-brand-btnBorder flex items-center justify-center mb-4">
                <img
                  src={AVATARES[avatarIndex].src}
                  alt={AVATARES[avatarIndex].alt}
                  className="w-24 h-24 object-contain rounded-full"
                />
                <button
                  type="button"
                  onClick={avatarAnterior}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-btnBg text-white rounded-full font-bold text-xl shadow-md hover:scale-110 transition-transform flex items-center justify-center border-2 border-white"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={proximoAvatar}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-btnBg text-white rounded-full font-bold text-xl shadow-md hover:scale-110 transition-transform flex items-center justify-center border-2 border-white"
                >
                  &gt;
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDialogAberto(true)}
                className="text-brand-textDark font-bold text-lg md:text-xl bg-white/50 px-4 py-1 rounded-full shadow-sm hover:bg-white/80 transition-all"
              >
                Escolher avatar
              </button>
            </div>

            {/* Campos */}
            <div className="flex-1 w-full flex flex-col space-y-6">
              <div>
                <label htmlFor="playerName" className="block text-brand-textDark font-bold text-lg md:text-xl mb-2 ml-2">
                  Nome / Apelido:
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Pedrinho"
                  className="w-full bg-brand-inputBg border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg md:text-xl font-medium transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="playerAge" className="block text-brand-textDark font-bold text-lg md:text-xl mb-2 ml-2">
                  Idade:
                </label>
                <input
                  type="number"
                  id="playerAge"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Sua idade"
                  className="w-full bg-brand-inputBg border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg md:text-xl font-medium transition-all duration-300"
                  required
                  min="6"
                  max="99"
                />
              </div>
            </div>
          </form>

          {/* Erro */}
          {erro && (
            <p className="text-red-500 text-center bg-red-100 p-3 rounded-xl font-medium mt-4">{erro}</p>
          )}

          {/* Botão */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <button
              form="createPlayerForm"
              type="submit"
              disabled={loading}
              className="bg-brand-btnBg text-[#E3F4B9] border-[2px] border-brand-btnBorder rounded-full w-full md:w-auto px-8 md:px-16 py-4 text-xl md:text-2xl font-bold hover:bg-[#7da02b] transition-colors shadow-[0px_6px_0px_rgba(93,125,14,0.3)] active:shadow-none active:translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-brand-btnBorder disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'CRIAR JOGADOR'}
            </button>
          </div>
        </div>
      </main>

      {/* Drawer Mobile */}
      <div id="drawerOverlay" className="fixed inset-0 bg-brand-textDark/40 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"></div>

      <div id="mobileDrawer" className="fixed top-0 right-0 h-full w-[280px] bg-brand-cardBg shadow-2xl z-[100] transform translate-x-full transition-transform duration-300 flex flex-col border-l-[3px] border-[#D6E2C6]/50 rounded-l-[40px] md:hidden">
        <div className="flex justify-end p-6 pt-10">
          <button id="closeDrawerBtn" className="w-12 h-12 bg-white/50 text-brand-textDark rounded-full flex items-center justify-center font-black text-xl hover:bg-white/80 transition-all border-[2px] border-white/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/50">
            X
          </button>
        </div>
        <div className="flex flex-col px-6 gap-6 mt-4">
          <button onClick={() => navigate('/escolha_perfil')} className="w-full bg-white/40 text-brand-textDark rounded-full px-6 py-4 font-bold text-[18px] shadow-sm hover:bg-white/70 active:scale-95 transition-all border-[2px] border-white/50 text-center focus:outline-none focus:ring-4 focus:ring-white/50">
            Voltar
          </button>
        </div>
      </div>

      {/* Diálogo de ícones (agora também usando AVATARES) */}
      <IconesDialog
        aberto={dialogAberto}
        onFechar={() => setDialogAberto(false)}
        onSelecionar={(indice) => setAvatarIndex(indice)}
        onConfirmar={() => setDialogAberto(false)}
        avatares={AVATARES}        // 👈 passando a constante AVATARES
        selecionado={avatarIndex}
      />
    </div>
  )
}