import { IGameRepository, GameFilter } from '../../domain/repositories/game.repository'
import { Game, GameSession } from '../../domain/entities/game'
import { GameModel, GameSessionModel } from '../database/models/game.model'

export class MongoGameRepository implements IGameRepository {
  
  private toDomain(gameDoc: any): Game {
    return new Game({
      id: gameDoc._id,
      title: gameDoc.title,
      description: gameDoc.description,
      category: gameDoc.category,
      difficulty: gameDoc.difficulty,
      minAge: gameDoc.minAge,
      maxAge: gameDoc.maxAge,
      pointsReward: gameDoc.pointsReward,
      isActive: gameDoc.isActive,
      createdAt: gameDoc.createdAt,
      updatedAt: gameDoc.updatedAt
    })
  }

  private toSessionDomain(sessionDoc: any): GameSession {
    return new GameSession(
      sessionDoc._id,
      sessionDoc.childId,
      sessionDoc.gameId,
      sessionDoc.score,
      sessionDoc.completedAt,
      sessionDoc.timeSpentSeconds,
      sessionDoc.createdAt
    )
  }

  async findById(id: string): Promise<Game | null> {
    const gameDoc = await GameModel.findById(id).exec()
    if (!gameDoc) return null
    return this.toDomain(gameDoc)
  }

  async findAll(filter?: GameFilter): Promise<Game[]> {
    const query: any = {}
    
    if (filter?.category) query.category = filter.category
    if (filter?.difficulty) query.difficulty = filter.difficulty
    if (filter?.isActive !== undefined) query.isActive = filter.isActive
    
    // Filtro por idade
    if (filter?.minAge !== undefined) query.minAge = { $lte: filter.minAge }
    if (filter?.maxAge !== undefined) query.maxAge = { $gte: filter.maxAge }
    
    const gamesDocs = await GameModel.find(query).exec()
    return gamesDocs.map((doc: any) => this.toDomain(doc))
  }

  async create(game: Game): Promise<Game> {
    const created = await GameModel.create({
      _id: game.id,
      title: game.title,
      description: game.description,
      category: game.category,
      difficulty: game.difficulty,
      minAge: game.minAge,
      maxAge: game.maxAge,
      pointsReward: game.pointsReward,
      isActive: game.isActive
    })
    return this.toDomain(created)
  }

  async update(game: Game): Promise<Game> {
    const updated = await GameModel.findByIdAndUpdate(
      game.id,
      {
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty,
        minAge: game.minAge,
        maxAge: game.maxAge,
        pointsReward: game.pointsReward,
        isActive: game.isActive
      },
      { new: true, runValidators: true }
    ).exec()
    
    if (!updated) {
      throw new Error('Game not found')
    }
    
    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    const result = await GameModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new Error('Game not found')
    }
  }

  async saveSession(session: GameSession): Promise<GameSession> {
    const created = await GameSessionModel.create({
      _id: session.id,
      childId: session.childId,
      gameId: session.gameId,
      score: session.score,
      completedAt: session.completedAt,
      timeSpentSeconds: session.timeSpentSeconds
    })
    return this.toSessionDomain(created)
  }

  async findSessionsByChild(childId: string): Promise<GameSession[]> {
    const sessions = await GameSessionModel.find({ childId })
      .sort({ completedAt: -1 })
      .exec()
    return sessions.map((doc: any) => this.toSessionDomain(doc))
  }

  async findSessionsByGame(gameId: string): Promise<GameSession[]> {
    const sessions = await GameSessionModel.find({ gameId })
      .sort({ completedAt: -1 })
      .exec()
    return sessions.map((doc: any) => this.toSessionDomain(doc))
  }
}