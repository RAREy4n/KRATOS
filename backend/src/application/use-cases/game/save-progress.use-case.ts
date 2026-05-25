import { IGameRepository } from '../../../domain/repositories/game.repository'
import { IChildRepository } from '../../../domain/repositories/child.repository'
import { GameSession } from '../../../domain/entities/game'
import { SaveProgressDTO, GameProgressResponseDTO } from '../../dtos/game.dto'
import { DomainError } from '../../errors/domain.errors'

// Jogos registrados diretamente no código (sem precisar de cadastro no MongoDB)
// Adicione aqui cada jogo do Zeus conforme for crescendo
const STATIC_GAMES: Record<string, { pointsReward: number; minAge: number; maxAge: number }> = {
  'robo-pizzaiolo': { pointsReward: 500, minAge: 8, maxAge: 18 }, // Aumentei a maxAge para testarmos sem problemas
}

export class SaveProgressUseCase {
  constructor(
    private gameRepository: IGameRepository,
    private childRepository: IChildRepository
  ) {}

  async execute(data: SaveProgressDTO): Promise<GameProgressResponseDTO> {
    const child = await this.childRepository.findById(data.childId)
    if (!child) {
      throw new DomainError('Child not found', 'CHILD_NOT_FOUND', 404)
    }

    // Verifica primeiro nos jogos estáticos (Zeus), depois no MongoDB
    const staticGame = STATIC_GAMES[data.gameId]

    if (!staticGame) {
      // Tenta buscar no banco para os 12 jogos internos
      const game = await this.gameRepository.findById(data.gameId)
      if (!game) {
        throw new DomainError('Game not found', 'GAME_NOT_FOUND', 404)
      }
      if (!game.isActive) {
        throw new DomainError('Game is not active', 'GAME_INACTIVE', 400)
      }
      if (!game.isSuitableForAge(child.age)) {
        throw new DomainError('Game not suitable for child age', 'GAME_AGE_MISMATCH', 400)
      }

      const session = new GameSession(
        crypto.randomUUID(),
        data.childId,
        data.gameId,
        data.score,
        new Date(),
        data.timeSpentSeconds,
        new Date()
      )
      const savedSession = await this.gameRepository.saveSession(session)

      const earnedPoints = game.calculateReward(data.score)
      if (earnedPoints > 0) {
        child.addPoints(earnedPoints)
        await this.childRepository.update(child)
      }

      return {
        id: savedSession.id,
        childId: savedSession.childId,
        gameId: savedSession.gameId,
        score: savedSession.score,
        completedAt: savedSession.completedAt,
        timeSpentSeconds: savedSession.timeSpentSeconds,
        createdAt: savedSession.createdAt
      }
    }

    // Fluxo para Jogo estático (Zeus) — valida idade manualmente
    if (child.age < staticGame.minAge || child.age > staticGame.maxAge) {
      throw new DomainError('Game not suitable for child age', 'GAME_AGE_MISMATCH', 400)
    }

    const session = new GameSession(
      crypto.randomUUID(),
      data.childId,
      data.gameId,
      data.score,
      new Date(),
      data.timeSpentSeconds,
      new Date()
    )
    const savedSession = await this.gameRepository.saveSession(session)

    // Normaliza score para o Zeus
    const normalized = Math.min(data.score / 1000, 1)
    const earnedPoints = Math.floor(staticGame.pointsReward * normalized)
    if (earnedPoints > 0) {
      child.addPoints(earnedPoints)
      await this.childRepository.update(child)
    }

    return {
      id: savedSession.id,
      childId: savedSession.childId,
      gameId: savedSession.gameId,
      score: savedSession.score,
      completedAt: savedSession.completedAt,
      timeSpentSeconds: savedSession.timeSpentSeconds,
      createdAt: savedSession.createdAt
    }
  }
}