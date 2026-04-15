import { z } from 'zod'
import { GameCategory, Difficulty } from '../../domain/entities/game'

export const CreateGameSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['math', 'reading', 'logic', 'memory', 'creativity']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  minAge: z.number().int().min(0).max(18),
  maxAge: z.number().int().min(0).max(18),
  pointsReward: z.number().int().positive('Points reward must be positive')
})

export const UpdateGameSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(['math', 'reading', 'logic', 'memory', 'creativity']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  minAge: z.number().int().min(0).max(18).optional(),
  maxAge: z.number().int().min(0).max(18).optional(),
  pointsReward: z.number().int().positive().optional()
})

export const SaveProgressSchema = z.object({
  childId: z.string().uuid('Invalid child ID'),
  gameId: z.string().uuid('Invalid game ID'),
  score: z.number().int().min(0, 'Score cannot be negative').max(100, 'Score must be at most 100'),
  timeSpentSeconds: z.number().int().min(0, 'Time spent cannot be negative')
})

export const FilterGamesSchema = z.object({
  category: z.enum(['math', 'reading', 'logic', 'memory', 'creativity']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  age: z.number().int().min(0).max(18).optional(),
  isActive: z.boolean().optional()
})

export type CreateGameDTO = z.infer<typeof CreateGameSchema>
export type UpdateGameDTO = z.infer<typeof UpdateGameSchema>
export type SaveProgressDTO = z.infer<typeof SaveProgressSchema>
export type FilterGamesDTO = z.infer<typeof FilterGamesSchema>

export interface GameResponseDTO {
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

export interface GameProgressResponseDTO {
  id: string
  childId: string
  gameId: string
  score: number
  completedAt: Date
  timeSpentSeconds: number
  createdAt: Date
}