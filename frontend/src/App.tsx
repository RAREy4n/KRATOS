import { Routes, Route } from 'react-router-dom'
import Login from './presentation/pages/login'
import Cadastro from './presentation/pages/criarconta'
import EscolhaPerfil from './presentation/pages/escolha_perfil'
import CriarJogador from './presentation/pages/criar_jogador'
import Index from './presentation/pages/index'
import Relatorio from './presentation/pages/relatorio'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/escolha_perfil" element={<EscolhaPerfil />} />
      <Route path="/criar_jogador" element={<CriarJogador />} />
      <Route path="/relatorio" element={<Relatorio />} />

      {/* fallback seguro */}
      <Route path="*" element={<Index />} />
    </Routes>

  )
}