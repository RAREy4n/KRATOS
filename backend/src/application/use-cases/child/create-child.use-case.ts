import { IChildRepository } from '../../../domain/repositories/child.repository'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { Child } from '../../../domain/entities/child'
import { CreateChildDTO, ChildResponseDTO } from '../../dtos/child.dto'
import { DomainError } from '../../errors/domain.errors'

export class CreateChildUseCase {
  constructor(
    private childRepository: IChildRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateChildDTO, parentId: string): Promise<ChildResponseDTO> {
    const parent = await this.userRepository.findById(parentId)
    if (!parent) {
      throw new DomainError('Parent not found', 'PARENT_NOT_FOUND')
    }

    if (!parent.canCreateChild()) {
      throw new DomainError('User is not a parent', 'USER_NOT_PARENT')
    }

    const child = new Child({
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age,
      parentId: parent.id,
      avatar: data.avatar || null,
      totalPoints: 0,
      currentLevel: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this.childRepository.create(child)

    const response: ChildResponseDTO = {
      id: child.id,
      name: child.name,
      age: child.age,
      parentId: child.parentId,
      avatar: child.avatar || null,
      totalPoints: child.totalPoints,
      currentLevel: child.currentLevel,
      createdAt: child.createdAt,
      updatedAt: child.updatedAt
    }

    return response
  }
}