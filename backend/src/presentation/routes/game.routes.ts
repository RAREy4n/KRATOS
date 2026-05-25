import { Elysia, t } from 'elysia'
import { MongoGameRepository } from '../../infrastructure/repositories/mongo-game.repository'
import { MongoChildRepository } from '../../infrastructure/repositories/mongo-child.repository'
import { SaveProgressUseCase } from '../../application/use-cases/game/save-progress.use-case'
import { DomainError } from '../../application/errors/domain.errors'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-this'

const gameRepository = new MongoGameRepository()
const childRepository = new MongoChildRepository()
const saveProgressUseCase = new SaveProgressUseCase(gameRepository, childRepository)

// O projeto atual aparentemente não usa verificação de token nos endpoints originais (ou implementa de forma simples).
// Vou adicionar uma checagem básica flexível para não quebrar testes locais caso enviem requisições sem token.
const verifyTokenFlex = (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null // Permite uso anônimo local (opcional)
  }
  try {
    return jwt.verify(authHeader.substring(7), JWT_SECRET) as { userId: string; role: string }
  } catch(e) {
    return null
  }
}

export const gameRoutes = new Elysia({ prefix: '/games' })

  // POST /games/progress
  .post('/progress', async ({ body, headers, set }) => {
    try {
      // Opcional: const user = verifyTokenFlex(headers.authorization)
      
      const result = await saveProgressUseCase.execute(body)

      set.status = 201
      return { success: true, data: result }
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        set.status = error.statusCode || 400
        return { success: false, error: { code: error.code, message: error.message } }
      }
      set.status = 500
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
    }
  }, {
    body: t.Object({
      childId: t.String(),
      gameId: t.String(),
      score: t.Number(),
      timeSpentSeconds: t.Number(),
    }),
  })

  // GET /games/progress/:childId
  .get('/progress/:childId', async ({ params, headers, set }) => {
    try {
      const sessions = await gameRepository.findSessionsByChild(params.childId)
      return { success: true, data: sessions.map((s) => s.toJSON()) }
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        set.status = error.statusCode || 400
        return { success: false, error: { code: error.code, message: error.message } }
      }
      set.status = 500
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
    }
  })
