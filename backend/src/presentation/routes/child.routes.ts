import { Elysia, t } from 'elysia'
import { MongoChildRepository } from '../../infrastructure/repositories/mongo-child.repository'
import { MongoUserRepository } from '../../infrastructure/repositories/mongo-user.repository'
import { CreateChildUseCase } from '../../application/use-cases/child/create-child.use-case'
import { CreateChildSchema, UpdateChildSchema } from '../../application/dtos/child.dto'
import { DomainError, UnauthorizedError } from '../../application/errors/domain.errors'
import * as jwt from 'jsonwebtoken'
import { Child } from '../../domain/entities/child'

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Repositories
const childRepository = new MongoChildRepository()
const userRepository = new MongoUserRepository()

// Use Cases
const createChildUseCase = new CreateChildUseCase(childRepository, userRepository)

// Helper para extrair usuário do token
const extractUserFromToken = (authHeader: string | undefined): { userId: string; role: string } => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided')
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    return { userId: decoded.userId, role: decoded.role }
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

export const childRoutes = new Elysia({ prefix: '/children' })
  
  // POST /children - Criar perfil de criança (apenas para pais)
  .post('/', async ({ body, headers, set }) => {
    try {
      const { userId, role } = extractUserFromToken(headers.authorization)
      
      if (role !== 'parent') {
        throw new DomainError('Only parents can create child profiles', 'FORBIDDEN', 403)
      }
      
      const validatedData = CreateChildSchema.parse(body)
      const result = await createChildUseCase.execute(validatedData, userId)
      
      set.status = 201
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 400
      
      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
      
      if (error.errors) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors
          }
        }
      }
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        }
      }
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 2 }),
      age: t.Number({ minimum: 0, maximum: 18 }),
      avatar: t.Optional(t.Nullable(t.String({ format: 'uri' })))
    })
  })
  
  // GET /children - Listar todas as crianças do pai logado
  .get('/', async ({ headers, set }) => {
    try {
      const { userId, role } = extractUserFromToken(headers.authorization)
      
      // CORRIGIDO: Tipagem explícita do array
      let childrenList: Child[] = []
      
      if (role === 'parent') {
        childrenList = await childRepository.findByParentId(userId)
      }
      
      return {
        success: true,
        data: childrenList.map((child: Child) => child.toJSON())
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 500
      
      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        }
      }
    }
  })
  
  // GET /children/:id - Obter criança específica
  .get('/:id', async ({ params, headers, set }) => {
    try {
      const { userId, role } = extractUserFromToken(headers.authorization)
      const child = await childRepository.findById(params.id)
      
      if (!child) {
        set.status = 404
        return {
          success: false,
          error: {
            code: 'CHILD_NOT_FOUND',
            message: 'Child not found'
          }
        }
      }
      
      // Verificar permissão: pai da criança ou admin
      if (role === 'parent' && !child.belongsToParent(userId)) {
        set.status = 403
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to view this child'
          }
        }
      }
      
      return {
        success: true,
        data: child.toJSON()
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 500
      
      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        }
      }
    }
  })
  
  // PUT /children/:id - Atualizar criança
  .put('/:id', async ({ params, body, headers, set }) => {
    try {
      const { userId, role } = extractUserFromToken(headers.authorization)
      const child = await childRepository.findById(params.id)
      
      if (!child) {
        set.status = 404
        return {
          success: false,
          error: {
            code: 'CHILD_NOT_FOUND',
            message: 'Child not found'
          }
        }
      }
      
      // Verificar permissão
      if (role !== 'parent' || !child.belongsToParent(userId)) {
        set.status = 403
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this child'
          }
        }
      }
      
      const validatedData = UpdateChildSchema.parse(body)
      
      // CORRIGIDO: Garantir que avatar seja string ou undefined (não null)
      const avatarValue = validatedData.avatar === null ? undefined : validatedData.avatar
      
      child.updateProfile(
        validatedData.name || child.name,
        validatedData.age !== undefined ? validatedData.age : child.age,
        avatarValue
      )
      
      const updated = await childRepository.update(child)
      
      return {
        success: true,
        data: updated.toJSON()
      }
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 400
      
      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
      
      if (error.errors) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors
          }
        }
      }
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        }
      }
    }
  }, {
    body: t.Object({
      name: t.Optional(t.String({ minLength: 2 })),
      age: t.Optional(t.Number({ minimum: 0, maximum: 18 })),
      avatar: t.Optional(t.Nullable(t.String({ format: 'uri' })))
    })
  })
  
  // DELETE /children/:id - Remover criança
  .delete('/:id', async ({ params, headers, set }) => {
    try {
      const { userId, role } = extractUserFromToken(headers.authorization)
      const child = await childRepository.findById(params.id)
      
      if (!child) {
        set.status = 404
        return {
          success: false,
          error: {
            code: 'CHILD_NOT_FOUND',
            message: 'Child not found'
          }
        }
      }
      
      // Verificar permissão
      if (role !== 'parent' || !child.belongsToParent(userId)) {
        set.status = 403
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this child'
          }
        }
      }
      
      await childRepository.delete(params.id)
      
      set.status = 204
      return {}
    } catch (error: any) {
      set.status = error instanceof DomainError ? error.statusCode : 500
      
      if (error instanceof DomainError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }
      
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        }
      }
    }
  })