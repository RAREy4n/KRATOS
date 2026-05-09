import { useState, useEffect, useRef } from 'react'

export default function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(1)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const extension = '.mpeg'
    
    if (!audioRef.current) {
      audioRef.current = new Audio(`/jogos/som/song${currentTrack}${extension}`)
      audioRef.current.volume = 0.2
    }

    const audio = audioRef.current

    // Função para tentar dar play
    const tryPlay = () => {
      if (!isMuted && audio.paused) {
        audio.play()
          .then(() => setHasInteracted(true))
          .catch(() => {
            // Ainda bloqueado, aguarda próxima interação
          })
      }
    }

    // Ouvinte de clique global para liberar o som no primeiro clique no site
    const handleGlobalClick = () => {
      if (!hasInteracted) {
        tryPlay()
      }
    }

    window.addEventListener('click', handleGlobalClick)
    window.addEventListener('keydown', handleGlobalClick)

    const handleEnded = () => {
      const nextTrack = currentTrack === 1 ? 2 : 1
      setCurrentTrack(nextTrack)
      audio.src = `/jogos/som/song${nextTrack}${extension}`
      if (!isMuted) {
        audio.play().catch(() => {})
      }
    }

    audio.addEventListener('ended', handleEnded)

    if (!isMuted) {
      tryPlay()
    } else {
      audio.pause()
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
      window.removeEventListener('click', handleGlobalClick)
      window.removeEventListener('keydown', handleGlobalClick)
    }
  }, [currentTrack, isMuted, hasInteracted])

  const toggleMute = () => {
    if (!audioRef.current) return
    
    if (isMuted) {
      // Se estava mudo, agora quer som. Tenta dar play imediatamente.
      setIsMuted(false)
      audioRef.current.play().catch(() => {})
    } else {
      // Se tinha som, agora quer mudo. Pausa imediatamente.
      setIsMuted(true)
      audioRef.current.pause()
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <button
        onClick={toggleMute}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all
          ${isMuted 
            ? 'bg-red-100 border-red-300 text-red-500' 
            : 'bg-brand-btnBg/20 border-white text-brand-btnBg animate-pulse'}
        `}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" stroke="#ef4444" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" stroke="#ef4444" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  )
}
