import { Elysia, t } from 'elysia'
import { MongoUserRepository } from '../../infrastructure/repositories/mongo-user.repository'
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case'
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case'
import { RegisterUserSchema, LoginUserSchema } from '../../application/dtos/auth.dto'
import { DomainError } from '../../application/errors/domain.errors'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

// Configurações
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-this'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

// Inicialização das dependências
const userRepository = new MongoUserRepository()

// Helpers
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash)
}

const generateToken = (userId: string, role: string): string => {
  const payload = { userId, role }
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as any }
  return jwt.sign(payload, JWT_SECRET, options)
}

const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new DomainError('Invalid or expired token', 'INVALID_TOKEN', 401)
  }
}

// Use Cases
const registerUseCase = new RegisterUseCase(userRepository, hashPassword)
const loginUseCase = new LoginUseCase(userRepository, comparePassword, generateToken)

export const authRoutes = new Elysia({ prefix: '/auth' })

  // POST /auth/register
  .post('/register', async ({ body, set }) => {
    try {
      const validatedData = RegisterUserSchema.parse(body)
      const result = await registerUseCase.execute(validatedData)

      set.status = 201
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 400

      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        }
      }
      if (error.errors) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors,
          },
        }
      }

      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      }
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 3 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      role: t.Optional(t.Enum({ parent: 'parent', child: 'child' })),
      avatar: t.Optional(t.Nullable(t.String({ format: 'uri' }))),
    }),
  })

  // POST /auth/login
  .post('/login', async ({ body, set }) => {
    try {
      const validatedData = LoginUserSchema.parse(body)
      const result = await loginUseCase.execute(validatedData)

      set.status = 200
      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 400

      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        }
      }

      if (error.errors) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors,
          },
        }
      }

      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      }
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
  })

  // GET /auth/me
  .get('/me', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'No token provided',
          },
        }
      }

      const token = authHeader.substring(7)

      try {
        const decoded: any = verifyToken(token)
        const user = await userRepository.findById(decoded.userId)

        if (!user) {
          set.status = 404
          return {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          }
        }

        return {
          success: true,
          data: user.toJSON(),
        }
      } catch (jwtError: any) {
        set.status = 401
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: jwtError.message || 'Invalid or expired token',
          },
        }
      }
    } catch (error: any) {
      set.status = 500
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      }
    }
  })

  // PUT /auth/me
  .put('/me', async ({ body, headers, set }) => {
    try {
      const authHeader = headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'No token provided',
          },
        }
      }

      const token = authHeader.substring(7)
      const decoded: any = jwt.verify(token, JWT_SECRET)
      const user = await userRepository.findById(decoded.userId)

      if (!user) {
        set.status = 404
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        }
      }

      const { name, avatar } = body as any

      if (name !== undefined || avatar !== undefined) {
        user.updateProfile(
          name !== undefined ? name : user.name,
          avatar !== undefined ? avatar : user.avatar,
        )
        await userRepository.update(user)
      }

      return {
        success: true,
        data: user.toJSON(),
      }
    } catch (error: any) {
      if (error.errors) {
        set.status = 400
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors,
          },
        }
      }

      if (error instanceof DomainError) {
        set.status = error.statusCode
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        }
      }

      set.status = 500
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error',
        },
      }
    }
  })