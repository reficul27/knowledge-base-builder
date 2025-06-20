// src/config/database.js - Fixed IPv6 connection issue
const mongoose = require('mongoose');

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected) {
    console.log('📊 MongoDB already connected');
    return;
  }

  try {
    // Use IPv4 explicitly to avoid IPv6 connection issues
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@127.0.0.1:27017/knowledge_base?authSource=admin';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in log
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      // Explicit auth options
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
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Connection refused. Try:');
      console.log('   - docker-compose up -d');
      console.log('   - Use 127.0.0.1 instead of localhost in .env');
      console.log('   - Check if port 27017 is blocked');
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
