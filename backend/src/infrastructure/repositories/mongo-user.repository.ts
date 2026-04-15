import { IUserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'
import { UserModel } from '../database/models/user.model'

export class MongoUserRepository implements IUserRepository {
  
  private toDomain(userDoc: any): User {
    return new User({
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      avatar: userDoc.avatar,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).exec()
    if (!userDoc) return null
    return this.toDomain(userDoc)
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).exec()
    if (!userDoc) return null
    return this.toDomain(userDoc)
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar
    })
    return this.toDomain(created)
  }

  async update(user: User): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        password: user.password,
        role: user.role,
        avatar: user.avatar
      },
      { new: true, runValidators: true }
    ).exec()
    
    if (!updated) {
      throw new Error('User not found')
    }
    
    return this.toDomain(updated)
  }
}