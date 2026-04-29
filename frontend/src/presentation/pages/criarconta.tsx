// src/pages/Cadastro.tsx
import { useEffect } from 'react'

export default function Cadastro() {
  useEffect(() => {
    // Carregar Tailwind CDN e config
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(tailwindScript)

    const configScript = document.createElement('script')
    configScript.src = '/tailwind-config.js'
    document.head.appendChild(configScript)

    return () => {
      document.head.removeChild(tailwindScript)
      document.head.removeChild(configScript)
    }
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    alert('Cadastro simulado com sucesso! 🎉 (Modo Apenas Front-end)')
    window.location.href = '/login'
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex items-center justify-center">

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

      <div className="relative z-10 w-full max-w-[600px] px-4 mx-auto mt-12 mb-10">
        <div className="bg-brand-cardBg rounded-[45px] px-6 md:px-12 pt-12 md:pt-16 pb-10 shadow-xl relative border-[3px] border-[#D6E2C6]/50">
          
          {/* Título destacado */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-inputBg border-[2px] border-brand-btnBorder rounded-full px-6 md:px-10 py-2 shadow-md">
            <h1 className="text-xl md:text-3xl font-bold text-brand-textDark whitespace-nowrap">BEM-VINDO!</h1>
          </div>

          <h2 className="text-[26px] text-brand-textDark text-center mb-6">
            Realize o cadastro de <span className="font-bold">responsável!</span>
          </h2>

          <form id="registerForm" onSubmit={handleSubmit} className="flex flex-col space-y-4">
            
            {/* Nome */}
            <div>
              <label htmlFor="nameInput" className="block text-brand-textDark font-medium mb-1 pl-3 text-lg">Preencha seus dados:</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-inputBorder group-focus-within:text-brand-btnBorder transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  id="nameInput"
                  type="text" 
                  placeholder="Nome" 
                  className="w-full bg-brand-inputBg border border-brand-inputBorder rounded-xl pl-12 pr-5 py-3 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="pt-1">
              <label htmlFor="emailInput" className="sr-only">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-inputBorder group-focus-within:text-brand-btnBorder transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  id="emailInput"
                  type="email" 
                  placeholder="E-mail" 
                  className="w-full bg-brand-inputBg border border-brand-inputBorder rounded-xl pl-12 pr-5 py-3 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="pt-3">
              <label htmlFor="passwordInput" className="block text-brand-textDark font-medium mb-1 pl-3 text-lg">Crie uma senha:</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-inputBorder group-focus-within:text-brand-btnBorder transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  id="passwordInput"
                  type="password" 
                  placeholder="Senha (6 a 8 carac.)" 
                  className="w-full bg-brand-inputBg border border-brand-inputBorder rounded-xl pl-12 pr-5 py-3 text-brand-textDark placeholder-brand-inputBorder/80 focus:outline-none focus:ring-2 focus:ring-brand-btnBorder shadow-inner text-lg transition-all duration-300"
                  minLength={6}
                  maxLength={8}
                  required
                />
              </div>
            </div>

            {/* Botão */}
            <div className="flex justify-center pt-8 pb-4">
              <button 
                type="submit" 
                className="bg-brand-btnBg text-brand-textDark border-[1.5px] border-brand-btnBorder rounded-xl px-12 py-3 text-xl font-bold hover:bg-[#7da02b] transition-colors shadow-[0px_4px_0px_rgba(93,125,14,0.3)] active:shadow-none active:translate-y-1"
              >
                CRIAR CONTA
              </button>
            </div>

            {/* Divisor */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-brand-inputBorder"></div>
              <span className="px-4 text-brand-textDark text-lg">ou</span>
              <div className="flex-1 border-t border-brand-inputBorder"></div>
            </div>

            {/* Link para login */}
            <div className="flex flex-col items-center pt-3">
              <span className="text-brand-textDark font-medium text-lg">Já tem uma conta?</span>
              <a href="/login" className="text-brand-textDark font-bold hover:underline text-lg mt-1">
                Faça login aqui!
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}