// src/config/database.js - Korrigierte Version für Docker MongoDB
const mongoose = require('mongoose');

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected) {
    console.log('📊 MongoDB already connected');
    return;
  }

  try {
    // Docker MongoDB Connection String
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/knowledge_base?authSource=admin';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in log
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Explizite Auth-Optionen
      authSource: 'admin',
      authMechanism: 'SCRAM-SHA-1'
    };

    await mongoose.connect(mongoUri, options);
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Helpful debugging info
    if (error.message.includes('authentication')) {
      console.log('💡 Authentication failed. Check:');
      console.log('   - Docker container is running: docker ps | findstr kb-mongodb');
      console.log('   - Credentials in .env file');
      console.log('   - Database name matches docker-compose.yml');
    }
    
    isConnected = false;
    throw error;
  }
};

const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('📊 MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnect error:', error);
  }
};

// Health check function
const checkMongoHealth = async () => {
  try {
    if (!isConnected) return false;
    
    // Simple ping to check connection
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error('❌ MongoDB health check failed:', error);
    return false;
  }
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  checkMongoHealth,
  isConnected: () => isConnected
};