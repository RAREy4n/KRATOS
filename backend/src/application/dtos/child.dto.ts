import { z } from 'zod'

export const CreateChildSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().min(0, 'Age cannot be negative').max(18, 'Age must be at most 18'),
  avatar: z.string().url().optional().nullable()
})

export const UpdateChildSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().int().min(0).max(18).optional(),
  avatar: z.string().url().optional().nullable()
})

export const AddPointsSchema = z.object({
  points: z.number().int().positive('Points must be positive')
})

export type CreateChildDTO = z.infer<typeof CreateChildSchema>
export type UpdateChildDTO = z.infer<typeof UpdateChildSchema>
export type AddPointsDTO = z.infer<typeof AddPointsSchema>

export interface ChildResponseDTO {
  id: string
  name: string
  age: number
  parentId: string
  avatar: string | null
  totalPoints: number
  currentLevel: number
  createdAt: Date
  updatedAt: Date
}