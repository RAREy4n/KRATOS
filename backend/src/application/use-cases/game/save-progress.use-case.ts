import { IGameRepository } from '../../../domain/repositories/game.repository'
import { IChildRepository } from '../../../domain/repositories/child.repository'
import { GameSession } from '../../../domain/entities/game'
import { SaveProgressDTO, GameProgressResponseDTO } from '../../dtos/game.dto'
import { DomainError } from '../../errors/domain.errors'

export class SaveProgressUseCase {
  constructor(
    private gameRepository: IGameRepository,
    private childRepository: IChildRepository
  ) {}

  async execute(data: SaveProgressDTO): Promise<GameProgressResponseDTO> {

    const child = await this.childRepository.findById(data.childId)
    if (!child) {
      throw new DomainError('Child not found', 'CHILD_NOT_FOUND')
    }

    const game = await this.gameRepository.findById(data.gameId)
    if (!game) {
      throw new DomainError('Game not found', 'GAME_NOT_FOUND')
    }

    if (!game.isActive) {
      throw new DomainError('Game is not active', 'GAME_INACTIVE')
    }

    if (!game.isSuitableForAge(child.age)) {
      throw new DomainError('Game not suitable for child age', 'GAME_AGE_MISMATCH')
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
}