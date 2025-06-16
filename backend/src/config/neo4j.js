// src/config/neo4j.js
const neo4j = require('neo4j-driver');

let driver = null;
let session = null;

const connectNeo4j = async () => {
  try {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD;

    if (!password) {
      throw new Error('NEO4J_PASSWORD must be set in environment variables');
    }

    // Create driver
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 30000,
      maxTransactionRetryTime: 30000
    });

    // Verify connectivity
    const serverInfo = await driver.getServerInfo();
    console.log('✅ Neo4j connected successfully');
    console.log(`🔗 Neo4j version: ${serverInfo.protocolVersion}`);
    console.log(`📍 Server: ${uri}`);

    // Create a default session for simple queries
    session = driver.session();

    // Test the connection with a simple query
    const result = await session.run('RETURN "Connection successful" as message');
    console.log('🧪 Neo4j test query:', result.records[0].get('message'));

  } catch (error) {
    console.error('❌ Neo4j connection failed:', error.message);
    throw error;
  }
};

const disconnectNeo4j = async () => {
  try {
    if (session) {
      await session.close();
      session = null;
    }
    if (driver) {
      await driver.close();
      driver = null;
    }
    console.log('🔗 Neo4j disconnected');
  } catch (error) {
    console.error('❌ Neo4j disconnect error:', error);
  }
};

// Get a new session for transactions
const getSession = () => {
  if (!driver) {
    throw new Error('Neo4j driver not initialized');
  }
  return driver.session();
};

// Execute a read query
const executeReadQuery = async (query, parameters = {}) => {
  const session = getSession();
  try {
    const result = await session.executeRead(tx => tx.run(query, parameters));
    return result.records;
  } finally {
    await session.close();
  }
};

// Execute a write query
const executeWriteQuery = async (query, parameters = {}) => {
  const session = getSession();
  try {
    const result = await session.executeWrite(tx => tx.run(query, parameters));
    return result.records;
  } finally {
    await session.close();
  }
};

// Health check function
const checkNeo4jHealth = async () => {
  try {
    if (!driver) return false;
    
    const session = getSession();
    try {
      await session.run('RETURN 1 as health');
      return true;
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('❌ Neo4j health check failed:', error);
    return false;
  }
};

// Initialize basic schema/constraints
const initializeSchema = async () => {
  try {
    console.log('🔧 Initializing Neo4j schema...');
    
    const constraints = [
      'CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE',
      'CREATE CONSTRAINT topic_id IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE',
      'CREATE CONSTRAINT session_id IF NOT EXISTS FOR (s:Session) REQUIRE s.id IS UNIQUE'
    ];

    for (const constraint of constraints) {
      try {
        await executeWriteQuery(constraint);
        console.log('✅ Constraint created:', constraint.split(' ')[2]);
      } catch (error) {
        // Constraint might already exist, that's okay
        if (!error.message.includes('already exists')) {
          console.warn('⚠️ Constraint warning:', error.message);
        }
      }
    }
    
    console.log('✅ Neo4j schema initialized');
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
  }
};

module.exports = {
  connectNeo4j,
  disconnectNeo4j,
  getSession,
  executeReadQuery,
  executeWriteQuery,
  checkNeo4jHealth,
  initializeSchema,
  getDriver: () => driver
};