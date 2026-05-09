export default function SkyDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Nuvens em Camadas (Paralax) */}
      <img 
        src="/imagem/Nuvens.svg" 
        className="absolute top-[10%] left-[-20%] w-[30%] opacity-40 animate-drift-slow" 
        alt="" 
      />
      <img 
        src="/imagem/Nuvens.svg" 
        className="absolute top-[25%] left-[-10%] w-[40%] opacity-60 animate-drift-med" 
        alt="" 
      />
      <img 
        src="/imagem/Nuvens.svg" 
        className="absolute top-[5%] left-[-30%] w-[25%] opacity-30 animate-drift-fast" 
        alt="" 
      />

      {/* Pássaros Voando */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="animate-fly" style={{ animationDelay: '0s' }}>
          <span className="text-2xl opacity-40">🦅</span>
        </div>
        <div className="animate-fly" style={{ animationDelay: '8s', animationDuration: '20s' }}>
          <span className="text-xl opacity-30">🦅</span>
        </div>
      </div>

      {/* Partículas Mágicas (Sparkles) */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-sparkle"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 5 + 's',
            opacity: 0.4
          }}
        />
      ))}

      {/* Montanhas (fixas no fundo) */}
      <img
        src="/imagem/Montanha.svg"
        className="absolute bottom-0 w-[200%] md:w-full max-w-none left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 h-auto translate-y-[15%] md:translate-y-[40%] object-cover opacity-80"
        alt=""
      />
    </div>
  )
}
