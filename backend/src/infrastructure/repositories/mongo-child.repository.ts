import { IChildRepository } from '../../domain/repositories/child.repository'
import { Child } from '../../domain/entities/child'
import { ChildModel } from '../database/models/child.model'

export class MongoChildRepository implements IChildRepository {
  
  private toDomain(childDoc: any): Child {
    return new Child({
      id: childDoc._id,
      name: childDoc.name,
      age: childDoc.age,
      parentId: childDoc.parentId,
      avatar: childDoc.avatar,
      totalPoints: childDoc.totalPoints,
      currentLevel: childDoc.currentLevel,
      createdAt: childDoc.createdAt,
      updatedAt: childDoc.updatedAt
    })
  }

  async findById(id: string): Promise<Child | null> {
    const childDoc = await ChildModel.findById(id).exec()
    if (!childDoc) return null
    return this.toDomain(childDoc)
  }

  async findByParentId(parentId: string): Promise<Child[]> {
    const childrenDocs = await ChildModel.find({ parentId }).exec()
    return childrenDocs.map(doc => this.toDomain(doc))
  }

  async create(child: Child): Promise<Child> {
    const created = await ChildModel.create({
      _id: child.id,
      name: child.name,
      age: child.age,
      parentId: child.parentId,
      avatar: child.avatar,
      totalPoints: child.totalPoints,
      currentLevel: child.currentLevel
    })
    return this.toDomain(created)
  }

  async update(child: Child): Promise<Child> {
    const updated = await ChildModel.findByIdAndUpdate(
      child.id,
      {
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        totalPoints: child.totalPoints,
        currentLevel: child.currentLevel
      },
      { new: true, runValidators: true }
    ).exec()
    
    if (!updated) {
      throw new Error('Child not found')
    }
    
    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    const result = await ChildModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new Error('Child not found')
    }
  }
}