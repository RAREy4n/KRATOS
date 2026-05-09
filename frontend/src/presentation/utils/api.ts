export const saveScore = async (category: 'aprender' | 'conversar' | 'jogar', points: number) => {
  try {
    const child = localStorage.getItem('selectedChild')
    if (!child) return
    
    const { id } = JSON.parse(child)
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:3001/children/${id}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ category, points })
    })

    const data = await response.json()
    if (data.success) {
      // Atualizar o cache local para refletir no Dashboard sem precisar dar F5
      localStorage.setItem('selectedChild', JSON.stringify({
        ...JSON.parse(child),
        totalPoints: data.data.totalPoints,
        currentLevel: data.data.currentLevel,
        skills: data.data.skills
      }))
    }
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error)
  }
}
