export interface ChildProps {
  id: string
  name: string
  age: number
  parentId: string 
  avatar?: string | null
  totalPoints: number
  currentLevel: number
  createdAt: Date
  updatedAt: Date
}

export class Child {
  private props: ChildProps

  constructor(props: ChildProps) {
    this.validateAge(props.age)
    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get age(): number {
    return this.props.age
  }

  get parentId(): string {
    return this.props.parentId
  }

  get avatar(): string | null | undefined {
    return this.props.avatar
  }

  get totalPoints(): number {
    return this.props.totalPoints
  }

  get currentLevel(): number {
    return this.props.currentLevel
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  private validateAge(age: number): void {
    if (age < 0 || age > 18) {
      throw new Error('Child age must be between 0 and 18 years')
    }
  }

  addPoints(points: number): void {
    if (points <= 0) {
      throw new Error('Points must be positive')
    }
    
    this.props.totalPoints += points
    this.checkLevelUp()
    this.props.updatedAt = new Date()
  }

  private checkLevelUp(): void {
    const newLevel = Math.floor(this.props.totalPoints / 1000) + 1
    
    if (newLevel > this.props.currentLevel) {
      this.props.currentLevel = newLevel
    }
  }

  updateProfile(name: string, age: number, avatar?: string): void {
    this.validateAge(age)
    
    this.props.name = name
    this.props.age = age
    if (avatar !== undefined) {
      this.props.avatar = avatar
    }
    this.props.updatedAt = new Date()
  }

  belongsToParent(parentId: string): boolean {
    return this.props.parentId === parentId
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      parentId: this.parentId,
      avatar: this.avatar,
      totalPoints: this.totalPoints,
      currentLevel: this.currentLevel,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}