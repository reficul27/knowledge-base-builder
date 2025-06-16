// src/config/redis.js
const redis = require('redis');

let client = null;
let isConnected = false;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    client = redis.createClient({
      url: redisUrl,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.log('⚠️ Redis server connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.log('❌ Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          console.log('❌ Redis retry attempts exhausted');
          return undefined;
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    });

    // Event listeners
    client.on('connect', () => {
      console.log('🔄 Redis connecting...');
    });

    client.on('ready', () => {
      console.log('✅ Redis connected and ready');
      isConnected = true;
    });

    client.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      isConnected = false;
    });

    client.on('end', () => {
      console.log('⚠️ Redis connection ended');
      isConnected = false;
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    // Connect to Redis
    await client.connect();
    
    // Test the connection
    await client.ping();
    console.log('🧪 Redis ping successful');
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    isConnected = false;
    
    // Redis is optional for MVP, so we don't throw
    console.log('⚠️ Continuing without Redis cache...');
  }
};

const disconnectRedis = async () => {
  try {
    if (client && isConnected) {
      await client.quit();
      console.log('⚡ Redis disconnected');
    }
    isConnected = false;
  } catch (error) {
    console.error('❌ Redis disconnect error:', error);
  }
};

// Cache helper functions
const setCache = async (key, value, expireInSeconds = 3600) => {
  try {
    if (!isConnected) return false;
    
    const serializedValue = JSON.stringify(value);
    await client.setEx(key, expireInSeconds, serializedValue);
    return true;
  } catch (error) {
    console.error('❌ Redis set error:', error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    if (!isConnected) return null;
    
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('❌ Redis get error:', error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    if (!isConnected) return false;
    
    await client.del(key);
    return true;
  } catch (error) {
    console.error('❌ Redis delete error:', error);
    return false;
  }
};

const deleteCachePattern = async (pattern) => {
  try {
    if (!isConnected) return false;
    
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error('❌ Redis delete pattern error:', error);
    return false;
  }
};

// Health check function
const checkRedisHealth = async () => {
  try {
    if (!isConnected || !client) return false;
    
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('❌ Redis health check failed:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  disconnectRedis,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  checkRedisHealth,
  isConnected: () => isConnected,
  getClient: () => client
};