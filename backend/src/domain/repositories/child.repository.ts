import { Child } from '../entities/child'

export interface IChildRepository {
  findById(id: string): Promise<Child | null>
  findByParentId(parentId: string): Promise<Child[]>
  create(child: Child): Promise<Child>
  update(child: Child): Promise<Child>
  delete(id: string): Promise<void>
}