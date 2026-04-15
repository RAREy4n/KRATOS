import { Game, GameSession } from '../entities/game'

export interface IGameRepository {
  findById(id: string): Promise<Game | null>
  findAll(filter?: GameFilter): Promise<Game[]>
  create(game: Game): Promise<Game>
  update(game: Game): Promise<Game>
  delete(id: string): Promise<void>
  saveSession(session: GameSession): Promise<GameSession>
  findSessionsByChild(childId: string): Promise<GameSession[]>
  findSessionsByGame(gameId: string): Promise<GameSession[]>
}

export interface GameFilter {
  category?: string
  difficulty?: string
  minAge?: number
  maxAge?: number
  isActive?: boolean
}