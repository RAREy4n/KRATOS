import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['parent', 'child'], 
    default: 'parent' 
  },
  avatar: { 
    type: String, 
    default: null 
  }
}, {
  timestamps: true,
  _id: false // Desabilita ObjectId automático, usamos UUID
})

export const UserModel = mongoose.model('User', UserSchema)