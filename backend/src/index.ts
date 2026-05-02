import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { connectDatabase } from './infrastructure/database/connection'
import { authRoutes } from './presentation/routes/auth.routes'
import { childRoutes } from './presentation/routes/child.routes'

await connectDatabase()

const app = new Elysia()
  .use(cors()) 
  
  .get('/', () => ({
    name: 'Organiza18 API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  }))
  
  // Rotas
  .use(authRoutes)
  .use(childRoutes)
  
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
  .listen(3001)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)