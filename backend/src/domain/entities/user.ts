export interface UserProps {
  id: string
  name: string
  email: string
  password: string
  role: 'parent' | 'child'
  avatar?: string | null
  createdAt: Date
  updatedAt: Date
}

export class User {
  private props: UserProps

  constructor(props: UserProps) {
    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get role(): 'parent' | 'child' {
    return this.props.role
  }

  get avatar(): string | null | undefined {
    return this.props.avatar
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  canCreateChild(): boolean {
    return this.role === 'parent'
  }

  canPlayGames(): boolean {
    return this.role === 'child'
  }

  updateProfile(name: string, avatar?: string): void {
    this.props.name = name
    if (avatar !== undefined) {
      this.props.avatar = avatar
    }
    this.props.updatedAt = new Date()
  }

  changePassword(newHashedPassword: string): void {
    this.props.password = newHashedPassword
    this.props.updatedAt = new Date()
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}