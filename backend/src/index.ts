import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { connectDatabase } from './infrastructure/database/connection'
import { authRoutes } from './presentation/routes/auth.routes'
import { childRoutes } from './presentation/routes/child.routes'
import { gameRoutes } from './presentation/routes/game.routes'

await connectDatabase()

// Lê as origens permitidas da variável de ambiente (separadas por vírgula)
// Em dev: http://localhost:5173,http://localhost:5174
// Em produção: https://kidquest.vercel.app,https://pizzaria-code.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true

  try {
    const { hostname } = new URL(origin)

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true
    }

    return (
      hostname.endsWith('.vercel.app') &&
      (hostname.startsWith('kidquest') || hostname.startsWith('zeus'))
    )
  } catch {
    return false
  }
}

const app = new Elysia()
  .use(cors({
    origin: ({ headers }) => isAllowedOrigin(headers.get('origin') || undefined),
    credentials: true
  }))
  
  .get('/', () => ({
    name: 'Organiza18 API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  }))
  
  // Rotas
  .use(authRoutes)
  .use(childRoutes)
  .use(gameRoutes)
  
  // Tratamento de erros
  .onError(({ code, error, set }) => {
    console.error('Error:', error)
    
    if (code === 'NOT_FOUND') {
      set.status = 404
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found'
        }
      }
    }
    
    set.status = 500
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }
  })
  
  // Iniciar servidor
  .listen(Number(process.env.PORT) || 3001)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)
