import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function ResponsavelPerfil() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setNome(user.name)
      setEmail(user.email)
    }
  }, [])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    try {
      // Aqui simularíamos uma atualização no backend se houvesse a rota
      // Por enquanto, atualizamos o localStorage para refletir no app
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const updatedUser = { ...user, name: nome }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setMensagem('Perfil atualizado com sucesso! ✨')
        setTimeout(() => navigate('/escolha_perfil'), 1500)
      }
    } catch (error) {
      setMensagem('Erro ao atualizar perfil. ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-sky-gradient min-h-screen relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <img key={i} src="/imagem/Nuvens.svg" className="animate-float opacity-70" alt="" />
        ))}
        <img src="/imagem/Montanha.svg" className="absolute bottom-0 w-full h-auto translate-y-[30%] object-cover opacity-90" alt="" />
      </div>

      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button onClick={() => navigate('/escolha_perfil')} className="bg-white/40 text-brand-textDark rounded-full px-6 py-2 font-bold border border-white/50 hover:bg-white/60 transition-all shadow-sm">
          ← Voltar
        </button>
        <div className="animate-swing">
          <img src="/imagem/logo.png" alt="KidQuest Logo" className="h-16 md:h-24" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="w-24"></div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[50px] border border-white/50 shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-black text-brand-textDark text-center mb-8">Meu Perfil 👤</h2>
          
          <form onSubmit={handleSalvar} className="space-y-6">
            <div>
              <label className="block text-brand-textDark/60 font-bold mb-2 ml-1">Nome do Responsável</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-white border-2 border-brand-inputBorder rounded-2xl px-5 py-3 text-lg font-bold text-brand-textDark focus:outline-none focus:ring-4 focus:ring-brand-btnBg/20"
                required
              />
            </div>

            <div>
              <label className="block text-brand-textDark/60 font-bold mb-2 ml-1">E-mail (Login)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl px-5 py-3 text-lg font-bold text-gray-400 cursor-not-allowed"
              />
            </div>

            {mensagem && (
              <p className={`text-center font-bold p-3 rounded-xl ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {mensagem}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-btnBg text-white rounded-2xl py-4 font-black text-xl shadow-[0_6px_0_#5d7d0e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'SALVAR ALTERAÇÕES'}
            </button>
          </form>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSoft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-float { animation: floatSoft 5s ease-in-out infinite; }
        @keyframes swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(4deg); } 75% { transform: rotate(-4deg); } }
        .animate-swing { animation: swing 3s ease-in-out infinite; transform-origin: top center; }
      `}} />
    </div>
  )
}
