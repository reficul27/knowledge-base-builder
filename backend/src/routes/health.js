// src/routes/health.js
const express = require('express');
const { checkMongoHealth } = require('../config/database');
const { checkNeo4jHealth } = require('../config/neo4j');
const { checkRedisHealth } = require('../config/redis');

const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Knowledge Base Builder API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Detailed health check with database status
router.get('/detailed', async (req, res) => {
  const healthChecks = {
    api: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    databases: {}
  };

  try {
    // Check MongoDB
    const mongoHealthy = await checkMongoHealth();
    healthChecks.databases.mongodb = {
      status: mongoHealthy ? 'healthy' : 'unhealthy',
      connected: mongoHealthy
    };

    // Check Neo4j
    const neo4jHealthy = await checkNeo4jHealth();
    healthChecks.databases.neo4j = {
      status: neo4jHealthy ? 'healthy' : 'unhealthy',
      connected: neo4jHealthy
    };

    // Check Redis
    const redisHealthy = await checkRedisHealth();
    healthChecks.databases.redis = {
      status: redisHealthy ? 'healthy' : 'unhealthy',
      connected: redisHealthy,
      optional: true // Redis is optional for MVP
    };

    // Determine overall health
    const criticalServicesHealthy = mongoHealthy && neo4jHealthy;
    const overallStatus = criticalServicesHealthy ? 'healthy' : 'unhealthy';
    
    healthChecks.status = overallStatus;
    healthChecks.summary = {
      critical_services: criticalServicesHealthy,
      optional_services: redisHealthy,
      all_systems: criticalServicesHealthy && redisHealthy
    };

    const statusCode = criticalServicesHealthy ? 200 : 503;
    res.status(statusCode).json(healthChecks);

  } catch (error) {
    console.error('❌ Health check error:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database-specific health checks
router.get('/mongodb', async (req, res) => {
  try {
    const isHealthy = await checkMongoHealth();
    
    res.status(isHealthy ? 200 : 503).json({
      service: 'MongoDB',
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      service: 'MongoDB',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/neo4j', async (req, res) => {
  try {
    const isHealthy = await checkNeo4jHealth();
    
    res.status(isHealthy ? 200 : 503).json({
      service: 'Neo4j',
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      service: 'Neo4j',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/redis', async (req, res) => {
  try {
    const isHealthy = await checkRedisHealth();
    
    res.status(isHealthy ? 200 : 503).json({
      service: 'Redis',
      status: isHealthy ? 'healthy' : 'unhealthy',
      optional: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      service: 'Redis',
      status: 'unhealthy',
      error: error.message,
      optional: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe (for container orchestration)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe (for container orchestration)
router.get('/ready', async (req, res) => {
  try {
    const mongoHealthy = await checkMongoHealth();
    const neo4jHealthy = await checkNeo4jHealth();
    
    const isReady = mongoHealthy && neo4jHealthy;
    
    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not-ready',
      checks: {
        mongodb: mongoHealthy,
        neo4j: neo4jHealthy
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not-ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;