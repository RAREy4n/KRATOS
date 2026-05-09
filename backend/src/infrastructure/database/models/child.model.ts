import mongoose from 'mongoose'

const ChildSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 18 
  },
  parentId: { 
    type: String, 
    required: true, 
    ref: 'User' 
  },
  avatar: { 
    type: String, 
    default: null 
  },
  totalPoints: { 
    type: Number, 
    default: 0,
    min: 0
  },
  currentLevel: { 
    type: Number, 
    default: 1,
    min: 1
  },
  skills: {
    aprender: {
      level: { type: Number, default: 1, min: 1, max: 5 },
      xp: { type: Number, default: 0 }
    },
    conversar: {
      level: { type: Number, default: 1, min: 1, max: 5 },
      xp: { type: Number, default: 0 }
    },
    jogar: {
      level: { type: Number, default: 1, min: 1, max: 5 },
      xp: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true,
  _id: false
})

// Índices para consultas frequentes
ChildSchema.index({ parentId: 1 })
ChildSchema.index({ totalPoints: -1 }) // Ranking

export const ChildModel = mongoose.model('Child', ChildSchema)