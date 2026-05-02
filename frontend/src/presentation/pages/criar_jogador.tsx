// src/pages/CriarJogador.ts
export default function CriarJogador() {

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    alert('Jogador criado com sucesso! 🎉 (Modo Apenas Front-end)')
    window.location.href = '/escolha_perfil'
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden">

      {/* Nuvens e montanha */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <img 
        src="/imagem/Nuvens.svg"
        className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-[800px]"
      />
      <img 
        src="/imagem/Montanha.svg"
        className="absolute bottom-0 w-full"
      />
    </div>


      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 flex flex-row flex-wrap justify-between items-center md:items-start gap-5 md:gap-4 lg:gap-0">
        <button 
          className="relative cursor-pointer hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full" 
          onClick={() => window.location.href = '/escolha_perfil'}
          aria-label="Voltar para escolha de perfil"
        >
          <div className="bg-[#F6FAE3] rounded-full pr-8 pl-16 py-3 shadow-md flex items-center border-[2px] border-white/40">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-gray-200 rounded-full border-[3px] border-white shadow-sm overflow-hidden flex items-center justify-center">
              <span className="text-[10px] text-gray-500 text-center leading-tight">Avatar<br />Resp.</span>
            </div>
            <span className="text-brand-btnBg font-bold text-lg md:text-xl lg:text-2xl ml-4 truncate drop-shadow-sm max-w-[160px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-none">
              [Nome do responsável]
            </span>
          </div>
        </button>

        <button 
          onClick={() => window.location.href = '/escolha_perfil'} 
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
            
            <div className="flex flex-col items-center">
              <div className="relative w-[150px] h-[150px] md:w-[180px] md:h-[180px] bg-white rounded-full shadow-inner border-[4px] border-brand-btnBorder flex items-center justify-center mb-4">
                <span className="text-gray-400 font-bold">Avatar Aqui</span>
                <button 
                  type="button" 
                  aria-label="Avatar anterior" 
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-btnBg text-white rounded-full font-bold text-xl shadow-md hover:scale-110 transition-transform flex items-center justify-center border-2 border-white focus:outline-none focus:ring-4 focus:ring-brand-btnBg"
                >
                  &lt;
                </button>
                <button 
                  type="button" 
                  aria-label="Próximo avatar" 
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-btnBg text-white rounded-full font-bold text-xl shadow-md hover:scale-110 transition-transform flex items-center justify-center border-2 border-white focus:outline-none focus:ring-4 focus:ring-brand-btnBg"
                >
                  &gt;
                </button>
              </div>
              <span className="text-brand-textDark font-bold text-lg md:text-xl bg-white/50 px-4 py-1 rounded-full shadow-sm">Editar avatar</span>
            </div>

            <div className="flex-1 w-full flex flex-col space-y-6">
              
              <div>
                <label htmlFor="playerName" className="block text-brand-textDark font-bold text-lg md:text-xl mb-2 ml-2">Nome / Apelido:</label>
                <input 
                  type="text" 
                  id="playerName"
                  placeholder="Ex: Pedrinho" 
                  className="w-full bg-brand-inputBg border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg md:text-xl font-medium transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="playerAge" className="block text-brand-textDark font-bold text-lg md:text-xl mb-2 ml-2">Idade:</label>
                <input 
                  type="number" 
                  id="playerAge"
                  placeholder="Sua idade" 
                  className="w-full bg-brand-inputBg border-[2px] border-brand-inputBorder rounded-2xl px-6 py-4 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg md:text-xl font-medium transition-all duration-300"
                  required
                  min="6"
                  max="99"
                />
              </div>

            </div>

          </form>

          <div className="mt-10 md:mt-12 flex justify-center">
            <button 
              form="createPlayerForm"
              type="submit" 
              className="bg-brand-btnBg text-[#E3F4B9] border-[2px] border-brand-btnBorder rounded-full w-full md:w-auto px-8 md:px-16 py-4 text-xl md:text-2xl font-bold hover:bg-[#7da02b] transition-colors shadow-[0px_6px_0px_rgba(93,125,14,0.3)] active:shadow-none active:translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-brand-btnBorder"
            >
              CRIAR JOGADOR
            </button>
          </div>

        </div>
      </main>

      {/* Overlay e Drawer Mobile */}
      <div id="drawerOverlay" className="fixed inset-0 bg-brand-textDark/40 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"></div>

      <div id="mobileDrawer" className="fixed top-0 right-0 h-full w-[280px] bg-brand-cardBg shadow-2xl z-[100] transform translate-x-full transition-transform duration-300 flex flex-col border-l-[3px] border-[#D6E2C6]/50 rounded-l-[40px] md:hidden">
        <div className="flex justify-end p-6 pt-10">
          <button id="closeDrawerBtn" className="w-12 h-12 bg-white/50 text-brand-textDark rounded-full flex items-center justify-center font-black text-xl hover:bg-white/80 transition-all border-[2px] border-white/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/50">
            X
          </button>
        </div>
        <div className="flex flex-col px-6 gap-6 mt-4">
          <button onClick={() => window.location.href = '/escolha_perfil'} className="w-full bg-white/40 text-brand-textDark rounded-full px-6 py-4 font-bold text-[18px] shadow-sm hover:bg-white/70 active:scale-95 transition-all border-[2px] border-white/50 text-center focus:outline-none focus:ring-4 focus:ring-white/50">
            Voltar
          </button>
        </div>
      </div>

    </div>
  )
}