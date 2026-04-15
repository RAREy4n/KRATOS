import { IUserRepository } from '../../../domain/repositories/user.repository'
import { User } from '../../../domain/entities/user'
import { RegisterUserDTO, UserResponseDTO } from '../../dtos/auth.dto'
import { DomainError } from '../../errors/domain.errors'

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashPassword: (password: string) => Promise<string>
  ) {}

  async execute(data: RegisterUserDTO): Promise<UserResponseDTO> {
    // 1. Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new DomainError('User already exists', 'USER_ALREADY_EXISTS')
    }

    // 2. Criar hash da senha
    const hashedPassword = await this.hashPassword(data.password)

    // 3. Criar entidade de domínio
    const user = new User({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      avatar: data.avatar || null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // 4. Persistir no banco
    await this.userRepository.create(user)

    // 5. Retornar DTO (sem senha)
    return user.toJSON()
  }
}