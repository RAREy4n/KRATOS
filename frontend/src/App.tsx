import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './presentation/pages/login'
import Cadastro from './presentation/pages/criarconta'
import EscolhaPerfil from './presentation/pages/escolha_perfil'
import CriarJogador from './presentation/pages/criar_jogador'
import Relatorio from './presentation/pages/relatorio'
import Categorias from './presentation/pages/Categorias'
import CatalogoJogos from './presentation/pages/catalogoJogos' 
import ResponsavelPerfil from './presentation/pages/ResponsavelPerfil'
import BackgroundMusic from './presentation/components/BackgroundMusic'
import SkyDecorations from './presentation/components/SkyDecorations'

// Jogos
import MemoryGame from './presentation/pages/games/MemoryGame'
import ABCGame from './presentation/pages/games/ABCGame'
import WhichAnimalGame from './presentation/pages/games/WhichAnimalGame'
import SentenceGame from './presentation/pages/games/SentenceGame'
import QuizGame from './presentation/pages/games/QuizGame'
import CountingGame from './presentation/pages/games/CountingGame'
import EmotionsGame from './presentation/pages/games/EmotionsGame'
import ColorMixGame from './presentation/pages/games/ColorMixGame'
import ShapesGame from './presentation/pages/games/ShapesGame'
import FirstLetterGame from './presentation/pages/games/FirstLetterGame'
import RhymesGame from './presentation/pages/games/RhymesGame'
import BallCatcherGame from './presentation/pages/games/BallCatcherGame'

// Componente para proteger rotas (opcional, mas bom ter)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default function App() {
  // Som de clique global
  
  useEffect(() => {
    const playClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Se clicou em um botão ou em algo dentro de um botão
      if (target.closest('button')) {
        const audio = new Audio('/jogos/som/click.mpeg')
        audio.volume = 0.4
        audio.play().catch(() => {})
      }
    }

    window.addEventListener('click', playClick)
    return () => window.removeEventListener('click', playClick)
  }, [])

  return (
    <>
      <SkyDecorations />
      <BackgroundMusic />
      <Routes>
      {/* A PRIMEIRA PÁGINA AGORA É O LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* ROTAS PROTEGIDAS (PRECISA DE LOGIN) */}
      <Route path="/escolha_perfil" element={<PrivateRoute><EscolhaPerfil /></PrivateRoute>} />
      <Route path="/criar_jogador" element={<PrivateRoute><CriarJogador /></PrivateRoute>} />
      <Route path="/relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
      <Route path="/responsavel" element={<PrivateRoute><ResponsavelPerfil /></PrivateRoute>} />
      <Route path="/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
      <Route path="/catalogo/:categoria" element={<PrivateRoute><CatalogoJogos /></PrivateRoute>} />
      
      {/* Rotas dos Jogos */}
      <Route path="/jogos/memoria" element={<MemoryGame />} />
      <Route path="/jogos/abc" element={<ABCGame />} />
      <Route path="/jogos/animais" element={<WhichAnimalGame />} />
      <Route path="/jogos/frases" element={<SentenceGame />} />
      <Route path="/jogos/quiz" element={<QuizGame />} />
      <Route path="/jogos/contagem" element={<CountingGame />} />
      <Route path="/jogos/emocoes" element={<EmotionsGame />} />
      <Route path="/jogos/cores" element={<ColorMixGame />} />
      <Route path="/jogos/formas" element={<ShapesGame />} />
      <Route path="/jogos/letras" element={<FirstLetterGame />} />
      <Route path="/jogos/rimas" element={<RhymesGame />} />
      <Route path="/jogos/bolinhas" element={<BallCatcherGame />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  )
}