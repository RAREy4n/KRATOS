import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './presentation/pages/login'
import Cadastro from './presentation/pages/criarconta'
import EscolhaPerfil from './presentation/pages/escolha_perfil'
import CriarJogador from './presentation/pages/criar_jogador'
import Relatorio from './presentation/pages/relatorio'
import Categorias from './presentation/pages/Categorias'
import CatalogoJogos from './presentation/pages/catalogoJogos' 

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Categorias />} />
      <Route path="/catalogo/:categoria" element={<CatalogoJogos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/escolha_perfil" element={<EscolhaPerfil />} />
      <Route path="/criar_jogador" element={<CriarJogador />} />
      <Route path="/relatorio" element={<Relatorio />} />
      
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}