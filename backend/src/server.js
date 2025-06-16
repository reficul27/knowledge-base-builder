// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import route modules
const healthRoutes = require('./routes/health');
const topicsRoutes = require('./routes/topics');
const usersRoutes = require('./routes/users');
const mindmapsRoutes = require('./routes/mindmaps');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { connectMongoDB } = require('./config/database');
const { connectNeo4j } = require('./config/neo4j');
const { connectRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Basic middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/mindmaps', mindmapsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Knowledge Base Builder API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database connections and start server
async function startServer() {
  try {
    console.log('🚀 Starting Knowledge Base Builder Backend...');
    
    // Connect to databases
    console.log('📊 Connecting to MongoDB...');
    await connectMongoDB();
    
    console.log('🔗 Connecting to Neo4j...');
    await connectNeo4j();
    
    console.log('⚡ Connecting to Redis...');
    await connectRedis();
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
      console.log('💡 Ready to build knowledge graphs!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();