// src/pages/Index.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function Index() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    document.head.appendChild(tailwindScript)

    const configScript = document.createElement('script')
    configScript.src = '/tailwind-config.js'
    document.head.appendChild(configScript)

    // Redirecionar após 3.5 segundos
    const nextPage = searchParams.get('next') || '/login'
    const timer = setTimeout(() => {
      navigate(nextPage)
    }, 3500)

    return () => {
      document.head.removeChild(tailwindScript)
      document.head.removeChild(configScript)
      clearTimeout(timer)
    }
  }, [navigate, searchParams])

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center justify-center overflow-hidden">

      {/* Nuvens e montanha */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <img
          src="/imagem/Nuvens.svg"
          className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[130%] h-auto animate-[pulse_5s_ease-in-out_infinite]"
          alt=""
        />
        <img
          src="/imagem/Montanha.svg"
          className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover"
          alt=""
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-8 tracking-widest">
          Projeto 5
        </h1>

        <div className="flex space-x-4 bg-white/40 backdrop-blur-sm p-5 rounded-full shadow-lg border border-white/50">
          <div className="w-6 h-6 bg-brand-btnBg rounded-full bounce-delay-1 shadow-sm"></div>
          <div className="w-6 h-6 bg-brand-textDark rounded-full bounce-delay-2 shadow-sm"></div>
          <div className="w-6 h-6 bg-brand-btnBg rounded-full bounce-delay-3 shadow-sm"></div>
        </div>
        
        <p className="text-brand-textDark font-bold mt-8 text-xl bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm">
          Preparando sua aventura...
        </p>

      </div>
    </div>
  )
}