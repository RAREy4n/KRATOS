import { z } from 'zod'

export const RegisterUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['parent', 'child']).default('parent'),
  avatar: z.string().url().optional().nullable()
})

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  avatar: z.string().url().optional().nullable()
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
})

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>
export type LoginUserDTO = z.infer<typeof LoginUserSchema>
export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>

export interface UserResponseDTO {
  id: string
  name: string
  email: string
  role: 'parent' | 'child'
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponseDTO {
  user: UserResponseDTO
  token: string
}