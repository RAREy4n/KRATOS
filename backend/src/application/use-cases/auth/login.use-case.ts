import { IUserRepository } from '../../../domain/repositories/user.repository'
import { LoginUserDTO, AuthResponseDTO } from '../../dtos/auth.dto'
import { DomainError } from '../../errors/domain.errors'

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private comparePassword: (plain: string, hash: string) => Promise<boolean>,
    private generateToken: (userId: string, role: string) => string
  ) {}

  async execute(data: LoginUserDTO): Promise<AuthResponseDTO> {
    // 1. Buscar usuário por email
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new DomainError('Invalid credentials', 'INVALID_CREDENTIALS')
    }

    // 2. Verificar senha
    const isPasswordValid = await this.comparePassword(data.password, user.password)
    if (!isPasswordValid) {
      throw new DomainError('Invalid credentials', 'INVALID_CREDENTIALS')
    }

    // 3. Gerar token JWT
    const token = this.generateToken(user.id, user.role)

    // 4. Retornar resposta
    return {
      user: user.toJSON(),
      token
    }
  }
}