export class DomainError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message)
    this.name = 'DomainError'
    this.code = code
    this.statusCode = statusCode
    Object.setPrototypeOf(this, DomainError.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode
    }
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, code, 400)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, code: string = 'NOT_FOUND') {
    super(`${resource} not found`, code, 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, code, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    super(message, code, 403)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code, 409)
    this.name = 'ConflictError'
  }
}

export const ErrorCodes = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CHILD_NOT_FOUND: 'CHILD_NOT_FOUND',
  PARENT_NOT_FOUND: 'PARENT_NOT_FOUND',
  USER_NOT_PARENT: 'USER_NOT_PARENT',
  INVALID_AGE: 'INVALID_AGE',
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_INACTIVE: 'GAME_INACTIVE',
  GAME_AGE_MISMATCH: 'GAME_AGE_MISMATCH',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT'
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]