import mongoose from 'mongoose'

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/organiza18'
  const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@')
  console.log(`🔌 Connecting to MongoDB: ${sanitizedUri}`)
  
  try {
    await mongoose.connect(uri, {
      // Opções recomendadas para MongoDB Atlas
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
    })
    
    console.log('✅ MongoDB connected successfully')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🖥️  Host: ${mongoose.connection.host}`)
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    console.error('💡 Tips:')
    console.error('   - Check if your IP is whitelisted in MongoDB Atlas')
    console.error('   - Verify username and password in the connection string')
    console.error('   - Ensure network connectivity')
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB disconnected successfully')
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error)
  }
}

// Eventos de conexão para monitoramento
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Closing MongoDB connection...')
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Closing MongoDB connection...')
  await disconnectDatabase()
  process.exit(0)
})