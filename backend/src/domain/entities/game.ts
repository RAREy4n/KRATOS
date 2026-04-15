export type GameCategory = 'math' | 'reading' | 'logic' | 'memory' | 'creativity'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameProps {
  id: string
  title: string
  description: string
  category: GameCategory
  difficulty: Difficulty
  minAge: number
  maxAge: number
  pointsReward: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GameProgress {
  childId: string
  gameId: string
  score: number
  completedAt: Date
  timeSpentSeconds: number
}

export class Game {
  private props: GameProps

  constructor(props: GameProps) {
    this.validateAgeRange(props.minAge, props.maxAge)
    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get category(): GameCategory {
    return this.props.category
  }

  get difficulty(): Difficulty {
    return this.props.difficulty
  }

  get minAge(): number {
    return this.props.minAge
  }

  get maxAge(): number {
    return this.props.maxAge
  }

  get pointsReward(): number {
    return this.props.pointsReward
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  private validateAgeRange(minAge: number, maxAge: number): void {
    if (minAge < 0) {
      throw new Error('Minimum age cannot be negative')
    }
    if (maxAge > 18) {
      throw new Error('Maximum age cannot exceed 18')
    }
    if (minAge > maxAge) {
      throw new Error('Minimum age cannot be greater than maximum age')
    }
  }

  isSuitableForAge(age: number): boolean {
    return age >= this.props.minAge && age <= this.props.maxAge
  }

  activate(): void {
    if (this.props.isActive) {
      throw new Error('Game is already active')
    }
    this.props.isActive = true
    this.props.updatedAt = new Date()
  }

  deactivate(): void {
    if (!this.props.isActive) {
      throw new Error('Game is already inactive')
    }
    this.props.isActive = false
    this.props.updatedAt = new Date()
  }

  updateDetails(
    title: string,
    description: string,
    category: GameCategory,
    difficulty: Difficulty,
    pointsReward: number
  ): void {
    if (pointsReward <= 0) {
      throw new Error('Points reward must be positive')
    }

    this.props.title = title
    this.props.description = description
    this.props.category = category
    this.props.difficulty = difficulty
    this.props.pointsReward = pointsReward
    this.props.updatedAt = new Date()
  }

  updateAgeRange(minAge: number, maxAge: number): void {
    this.validateAgeRange(minAge, maxAge)
    this.props.minAge = minAge
    this.props.maxAge = maxAge
    this.props.updatedAt = new Date()
  }

  calculateReward(score: number): number {

    const percentageScore = Math.min(score / 100, 1) 
    return Math.floor(this.props.pointsReward * percentageScore)
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      minAge: this.minAge,
      maxAge: this.maxAge,
      pointsReward: this.pointsReward,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

export class GameSession {
  constructor(
    public readonly id: string,
    public readonly childId: string,
    public readonly gameId: string,
    public score: number,
    public completedAt: Date,
    public timeSpentSeconds: number,
    public readonly createdAt: Date
  ) {
    this.validateScore(score)
    this.validateTimeSpent(timeSpentSeconds)
  }

  private validateScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100')
    }
  }

  private validateTimeSpent(seconds: number): void {
    if (seconds < 0) {
      throw new Error('Time spent cannot be negative')
    }
  }

  isCompleted(): boolean {
    return this.completedAt !== null
  }

  updateScore(newScore: number): void {
    this.validateScore(newScore)
    this.score = newScore
  }

  toJSON() {
    return {
      id: this.id,
      childId: this.childId,
      gameId: this.gameId,
      score: this.score,
      completedAt: this.completedAt,
      timeSpentSeconds: this.timeSpentSeconds,
      createdAt: this.createdAt
    }
  }
}