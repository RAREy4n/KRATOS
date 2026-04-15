import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['math', 'reading', 'logic', 'memory', 'creativity'],
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    required: true 
  },
  minAge: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 18 
  },
  maxAge: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 18 
  },
  pointsReward: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true,
  _id: false
})

// Validação personalizada - CORRIGIDA
GameSchema.pre('validate', function(this: any, next: any) {
  if (this.minAge > this.maxAge) {
    next(new Error('Minimum age cannot be greater than maximum age'))
  } else {
    next()
  }
})

// Índices para performance
GameSchema.index({ category: 1 })
GameSchema.index({ difficulty: 1 })
GameSchema.index({ isActive: 1 })
GameSchema.index({ minAge: 1, maxAge: 1 })

export const GameModel = mongoose.model('Game', GameSchema)

// Model para sessões de jogo (progresso)
const GameSessionSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  childId: { 
    type: String, 
    required: true, 
    ref: 'Child' 
  },
  gameId: { 
    type: String, 
    required: true, 
    ref: 'Game' 
  },
  score: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  completedAt: { 
    type: Date, 
    required: true 
  },
  timeSpentSeconds: { 
    type: Number, 
    required: true, 
    min: 0 
  }
}, {
  timestamps: true,
  _id: false
})

// Índices para consultas de progresso
GameSessionSchema.index({ childId: 1, completedAt: -1 })
GameSessionSchema.index({ gameId: 1 })
GameSessionSchema.index({ childId: 1, gameId: 1 })

export const GameSessionModel = mongoose.model('GameSession', GameSessionSchema)