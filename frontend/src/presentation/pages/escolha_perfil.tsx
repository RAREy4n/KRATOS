// src/pages/EscolhaPerfil.tsx
import { useEffect, useRef } from 'react'

export default function EscolhaPerfil() {
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null)
  const closeDrawerBtnRef = useRef<HTMLButtonElement>(null)
  const mobileDrawerRef = useRef<HTMLDivElement>(null)
  const drawerOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(tailwindScript)

    const configScript = document.createElement('script')
    configScript.src = '/tailwind-config.js'
    document.head.appendChild(configScript)

    // Scrollbar customizada
    const style = document.createElement('style')
    style.textContent = `
      .scrollbar-custom::-webkit-scrollbar { width: 6px; }
      .scrollbar-custom::-webkit-scrollbar-track { background: #8BAF35; border-radius: 10px; margin: 10px 0; }
      .scrollbar-custom::-webkit-scrollbar-thumb { background: #5D7D0E; border-radius: 10px; }
      .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: #4a630b; }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(tailwindScript)
      document.head.removeChild(configScript)
      document.head.removeChild(style)
    }
  }, [])

  // Drawer mobile
  useEffect(() => {
    const hamburger = hamburgerBtnRef.current
    const closeBtn = closeDrawerBtnRef.current
    const drawer = mobileDrawerRef.current
    const overlay = drawerOverlayRef.current

    if (!hamburger || !closeBtn || !drawer || !overlay) return

    const openDrawer = () => {
      drawer.classList.remove('translate-x-full')
      overlay.classList.remove('opacity-0', 'pointer-events-none')
      overlay.classList.add('opacity-100', 'pointer-events-auto')
    }

    const closeDrawer = () => {
      drawer.classList.add('translate-x-full')
      overlay.classList.remove('opacity-100', 'pointer-events-auto')
      overlay.classList.add('opacity-0', 'pointer-events-none')
    }

    hamburger.addEventListener('click', openDrawer)
    closeBtn.addEventListener('click', closeDrawer)
    overlay.addEventListener('click', closeDrawer)

    return () => {
      hamburger.removeEventListener('click', openDrawer)
      closeBtn.removeEventListener('click', closeDrawer)
      overlay.removeEventListener('click', closeDrawer)
    }
  }, [])

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">

      {/* Nuvens e montanha */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <img
          src="/img/Nuvens2.svg"
          className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[130%] h-auto animate-[pulse_4s_ease-in-out_infinite]"
          alt=""
        />
        <img
          src="/img/montanha.svg"
          className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover"
          alt=""
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 flex flex-row flex-wrap justify-between items-center md:items-start gap-5 md:gap-4 lg:gap-0">
        <button
          className="relative cursor-pointer hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full"
          aria-label="Editar perfil do responsável"
        >
          <div className="bg-[#F6FAE3] rounded-full pr-8 pl-16 py-3 shadow-md flex items-center border-[2px] border-white/40">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-gray-200 rounded-full border-[3px] border-white shadow-sm overflow-hidden flex items-center justify-center">
              <span className="text-[10px] text-gray-500 text-center leading-tight">
                Avatar<br />Resp.
              </span>
            </div>
            <span className="text-brand-btnBg font-bold text-lg md:text-xl lg:text-2xl ml-4 truncate drop-shadow-sm max-w-[160px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-none">
              [Nome do responsável]
            </span>
          </div>
          <div className="absolute -right-2 -bottom-2 w-9 h-9 bg-brand-btnBg text-[#E3F4B9] rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </button>

        {/* Botões desktop */}
        <div className="hidden md:flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full sm:w-auto bg-white/40 text-brand-textDark rounded-full px-5 md:px-6 lg:px-8 py-3 font-bold text-[16px] md:text-[18px] lg:text-[20px] shadow-sm hover:bg-white/70 active:scale-95 transition-all border-[2px] border-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/50 shrink-0"
          >
            Sair
          </button>
          <button className="w-full sm:w-auto bg-brand-btnBg text-[#E3F4B9] rounded-full px-5 md:px-6 lg:px-8 py-3 font-bold text-[15px] md:text-[16px] lg:text-[20px] text-center leading-tight shadow-[0px_4px_0px_rgba(93,125,14,0.3)] hover:bg-[#7da02b] active:shadow-none active:translate-y-1 transition-all border-[2px] border-white/40 focus:outline-none focus:ring-4 focus:ring-brand-btnBorder shrink-0">
            RELATÓRIO DOS JOGADORES
          </button>
        </div>

        {/* Hamburger */}
        <button
          ref={hamburgerBtnRef}
          className="flex md:hidden flex-col items-center justify-center w-14 h-14 bg-white/40 border-[2px] border-white/50 rounded-full shadow-sm hover:bg-white/70 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/50 shrink-0"
          aria-label="Abrir menu"
        >
          <div className="w-6 h-1 bg-brand-textDark mb-1 rounded-full"></div>
          <div className="w-6 h-1 bg-brand-textDark mb-1 rounded-full"></div>
          <div className="w-6 h-1 bg-brand-textDark rounded-full"></div>
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 w-[85%] md:w-full max-w-[650px] mx-auto mt-[4vh] flex-1 flex flex-col mb-10">
        <div className="bg-brand-cardBg rounded-[40px] md:rounded-[55px] px-5 md:px-10 py-8 md:py-10 shadow-xl border-[3px] border-[#D6E2C6]/50 flex flex-col h-[70vh] min-h-[550px]">
          
          <h2 className="text-3xl md:text-4xl text-brand-btnBg font-bold text-center mb-6 drop-shadow-sm">
            Quem vai jogar agora?
          </h2>

          {/* Lista de jogadores */}
          <div id="playersList" className="flex-1 overflow-y-auto scrollbar-custom pr-6 space-y-2 mt-2">
            <div className="flex flex-col items-center justify-center h-full opacity-60 mt-12">
              <p className="text-brand-textDark text-[24px] font-bold text-center leading-snug">
                Nenhum jogador cadastrado.<br />Clique em "+" para adicionar!
              </p>
            </div>
          </div>

          {/* Botão adicionar */}
          <div className="mt-4 pt-2">
            <button
              onClick={() => window.location.href = '/criar_jogador'}
              className="flex items-center group w-full px-2 py-3 hover:bg-white/40 rounded-[24px] transition-colors"
            >
              <div className="w-[55px] h-[55px] bg-brand-btnBg text-[#E3F4B9] rounded-[18px] flex items-center justify-center text-4xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span className="relative -top-[3px] leading-none">+</span>
              </div>
              <span className="text-brand-textDark font-bold text-[28px] ml-5">Adicionar jogadores</span>
            </button>
          </div>

        </div>
      </main>

      {/* Drawer mobile */}
      <div
        ref={drawerOverlayRef}
        className="fixed inset-0 bg-brand-textDark/40 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"
      ></div>

      <div
        ref={mobileDrawerRef}
        className="fixed top-0 right-0 h-full w-[280px] bg-brand-cardBg shadow-2xl z-[100] transform translate-x-full transition-transform duration-300 flex flex-col border-l-[3px] border-[#D6E2C6]/50 rounded-l-[40px] md:hidden"
      >
        <div className="flex justify-end p-6 pt-10">
          <button
            ref={closeDrawerBtnRef}
            className="w-12 h-12 bg-white/50 text-brand-textDark rounded-full flex items-center justify-center font-black text-xl hover:bg-white/80 transition-all border-[2px] border-white/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            X
          </button>
        </div>
        <div className="flex flex-col px-6 gap-6 mt-4">
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-white/40 text-brand-textDark rounded-full px-6 py-4 font-bold text-[18px] shadow-sm hover:bg-white/70 active:scale-95 transition-all border-[2px] border-white/50 text-center focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Sair
          </button>
          <button className="w-full bg-brand-btnBg text-[#E3F4B9] rounded-[24px] px-6 py-5 font-bold text-[16px] text-center leading-tight shadow-[0px_4px_0px_rgba(93,125,14,0.3)] hover:bg-[#7da02b] active:shadow-none active:translate-y-1 transition-all border-[2px] border-white/40 focus:outline-none focus:ring-4 focus:ring-brand-btnBorder">
            RELATÓRIO DOS JOGADORES
          </button>
        </div>
      </div>
    </div>
  )
}