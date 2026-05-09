import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BallCatcherGame() {
  const navigate = useNavigate()
  const [balls, setBalls] = useState<{ id: number; left: number; top: number; color: string }[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameOver, setIsGameOver] = useState(false)

  const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500']

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true)
      return
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    const ballSpawner = setInterval(() => {
      const newBall = {
        id: Date.now(),
        left: Math.random() * 80 + 10,
        top: -10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }
      setBalls(prev => [...prev, newBall])
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(ballSpawner)
    }
  }, [timeLeft])

  useEffect(() => {
    const ballMover = setInterval(() => {
      setBalls(prev => prev.map(b => ({ ...b, top: b.top + 2 })).filter(b => b.top < 100))
    }, 50)
    return () => clearInterval(ballMover)
  }, [])

  const catchBall = (id: number) => {
    setScore(s => s + 10)
    setBalls(prev => prev.filter(b => b.id !== id))
    const audio = new Audio('/jogos/som/ploc.mp3')
    audio.play().catch(() => {})
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => navigate('/catalogo/jogar')} className="bg-white/30 backdrop-blur-md text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/40">← Voltar</button>
        <div className="flex gap-8">
            <span className="text-white font-black text-2xl">Tempo: {timeLeft}s</span>
            <span className="text-white font-black text-2xl">Pontos: {score}</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full overflow-hidden">
        {balls.map(ball => (
          <button
            key={ball.id}
            onClick={() => catchBall(ball.id)}
            className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full ${ball.color} border-4 border-white shadow-xl transition-transform active:scale-90`}
            style={{ left: `${ball.left}%`, top: `${ball.top}%` }}
          />
        ))}
      </main>

      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[50px] p-10 flex flex-col items-center text-center shadow-2xl border-8 border-brand-btnBg max-w-sm w-full">
            <span className="text-8xl mb-4">🏆</span>
            <h2 className="text-4xl font-black text-brand-textDark mb-2">FIM DE JOGO!</h2>
            <p className="text-xl text-brand-textDark/80 mb-8 font-medium">Você fez {score} pontos!</p>
            <button onClick={() => navigate('/catalogo/jogar')} className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] transition-all">VOLTAR AO INÍCIO</button>
          </div>
        </div>
      )}
    </div>
  )
}
