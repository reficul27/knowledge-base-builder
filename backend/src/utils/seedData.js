// src/utils/seedData.js - Verbesserte Version mit Duplikat-Handling
const Topic = require('../models/Topic');
const User = require('../models/User');
const Mindmap = require('../models/Mindmap');
const { connectMongoDB } = require('../config/database');

const sampleTopics = [
  {
    title: 'JavaScript Fundamentals',
    slug: 'javascript-fundamentals',
    description: 'Learn the core concepts of JavaScript programming language including variables, functions, objects, and control structures.',
    category: 'programming',
    difficulty: 'beginner',
    estimatedDurationMinutes: 180,
    prerequisites: [],
    learningObjectives: [
      'Understand JavaScript variables and data types',
      'Work with functions and scope',
      'Manipulate objects and arrays',
      'Control program flow with loops and conditionals'
    ],
    content: {
      summary: 'JavaScript is the programming language of the web. This comprehensive course covers all the fundamental concepts you need to start your JavaScript journey.',
      keyConcepts: ['variables', 'functions', 'objects', 'arrays', 'loops', 'conditionals'],
      sections: [
        {
          id: 'variables',
          title: 'Variables and Data Types',
          content: 'Learn about JavaScript variables, including var, let, and const, and understand different data types like strings, numbers, and booleans.',
          estimatedMinutes: 45
        },
        {
          id: 'functions',
          title: 'Functions and Scope',
          content: 'Master JavaScript functions, parameters, return values, and understand how scope works in JavaScript.',
          estimatedMinutes: 60
        },
        {
          id: 'objects',
          title: 'Objects and Arrays',
          content: 'Work with JavaScript objects and arrays, learn about methods and properties.',
          estimatedMinutes: 75
        }
      ]
    },
    tags: ['javascript', 'programming', 'web-development', 'beginner'],
    status: 'published',
    authorId: null // Will be set later
  },
  {
    title: 'React Components',
    slug: 'react-components',
    description: 'Understanding React component architecture, props, state, and lifecycle methods to build interactive user interfaces.',
    category: 'frontend',
    difficulty: 'intermediate',
    estimatedDurationMinutes: 150,
    prerequisites: ['javascript-fundamentals'],
    learningObjectives: [
      'Create functional and class components',
      'Understand props and state management',
      'Work with React lifecycle methods',
      'Build interactive user interfaces'
    ],
    content: {
      summary: 'React components are the building blocks of React applications. Learn how to create reusable, maintainable components.',
      keyConcepts: ['jsx', 'props', 'state', 'lifecycle', 'hooks'],
      sections: [
        {
          id: 'jsx',
          title: 'JSX Syntax',
          content: 'Learn JSX syntax and how to write HTML-like code in JavaScript.',
          estimatedMinutes: 30
        },
        {
          id: 'components',
          title: 'Component Types',
          content: 'Understand functional vs class components and when to use each.',
          estimatedMinutes: 45
        },
        {
          id: 'props-state',
          title: 'Props and State',
          content: 'Master component communication through props and local state management.',
          estimatedMinutes: 75
        }
      ]
    },
    tags: ['react', 'frontend', 'components', 'javascript'],
    status: 'published',
    authorId: null
  },
  {
    title: 'Node.js Basics',
    slug: 'nodejs-basics',
    description: 'Introduction to server-side JavaScript with Node.js, including modules, npm, and building simple web servers.',
    category: 'backend',
    difficulty: 'beginner',
    estimatedDurationMinutes: 120,
    prerequisites: ['javascript-fundamentals'],
    learningObjectives: [
      'Understand Node.js runtime environment',
      'Work with modules and npm packages',
      'Create simple web servers',
      'Handle file system operations'
    ],
    content: {
      summary: 'Node.js allows you to run JavaScript on the server. Learn the basics of backend development with Node.js.',
      keyConcepts: ['runtime', 'modules', 'npm', 'http', 'filesystem'],
      sections: [
        {
          id: 'intro',
          title: 'Introduction to Node.js',
          content: 'Understanding what Node.js is and how it differs from browser JavaScript.',
          estimatedMinutes: 30
        },
        {
          id: 'modules',
          title: 'Modules and NPM',
          content: 'Learn about CommonJS modules and how to use npm for package management.',
          estimatedMinutes: 45
        },
        {
          id: 'server',
          title: 'Creating Web Servers',
          content: 'Build your first HTTP server and handle requests and responses.',
          estimatedMinutes: 45
        }
      ]
    },
    tags: ['nodejs', 'backend', 'javascript', 'server'],
    status: 'published',
    authorId: null
  }
];

const sampleUser = {
  email: 'demo@example.com',
  password: 'demo123',
  name: 'Demo User',
  timezone: 'Europe/Berlin',
  language: 'en'
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // 1. Handle User Creation (Upsert)
    console.log('👤 Creating/updating sample user...');
    let user = await User.findOne({ email: sampleUser.email });
    
    if (user) {
      console.log(`✅ User already exists: ${user.email}`);
    } else {
      user = await User.createUser(sampleUser);
      console.log(`✅ User created: ${user.email}`);
    }
    
    // 2. Update topic authorIds and handle Topics (Upsert)
    console.log('📚 Creating/updating sample topics...');
    const topicsWithRealAuthor = sampleTopics.map(topic => ({
      ...topic,
      authorId: user._id
    }));
    
    let createdTopicsCount = 0;
    let updatedTopicsCount = 0;
    const topics = [];
    
    for (const topicData of topicsWithRealAuthor) {
      try {
        // Try to find existing topic by slug
        let topic = await Topic.findOne({ slug: topicData.slug });
        
        if (topic) {
          // Update existing topic
          Object.assign(topic, topicData);
          await topic.save();
          topics.push(topic);
          updatedTopicsCount++;
          console.log(`📝 Updated topic: ${topic.title}`);
        } else {
          // Create new topic
          topic = new Topic(topicData);
          await topic.save();
          topics.push(topic);
          createdTopicsCount++;
          console.log(`✅ Created topic: ${topic.title}`);
        }
      } catch (error) {
        console.error(`❌ Error with topic ${topicData.title}:`, error.message);
      }
    }
    
    console.log(`📚 Topics: ${createdTopicsCount} created, ${updatedTopicsCount} updated`);
    
    // 3. Handle Mindmap (Upsert)
    console.log('🧠 Creating/updating sample mindmap...');
    let mindmap = await Mindmap.findOne({ 
      userId: user._id, 
      name: 'Full-Stack Development Journey' 
    });
    
    if (mindmap) {
      console.log(`✅ Mindmap already exists: ${mindmap.name}`);
    } else {
      const mindmapData = {
        userId: user._id,
        name: 'Full-Stack Development Journey',
        description: 'My learning path to become a full-stack developer',
        layout: {
          style: 'force_directed',
          nodes: [
            {
              id: 'node1',
              topicId: 'javascript-fundamentals',
              position: { x: 200, y: 200 },
              size: 80,
              status: 'completed',
              color: '#10b981'
            },
            {
              id: 'node2',
              topicId: 'react-components',
              position: { x: 400, y: 150 },
              size: 70,
              status: 'in-progress',
              color: '#3b82f6'
            },
            {
              id: 'node3',
              topicId: 'nodejs-basics',
              position: { x: 400, y: 250 },
              size: 60,
              status: 'not-started',
              color: '#6b7280'
            }
          ],
          edges: [
            {
              id: 'edge1',
              source: 'node1',
              target: 'node2',
              type: 'prerequisite',
              strength: 0.9
            },
            {
              id: 'edge2',
              source: 'node1',
              target: 'node3',
              type: 'prerequisite',
              strength: 0.8
            }
          ]
        },
        tags: ['full-stack', 'web-development', 'learning-path']
      };
      
      mindmap = new Mindmap(mindmapData);
      await mindmap.save();
      console.log(`✅ Mindmap created: ${mindmap.name}`);
    }
    
    // 4. Summary
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 User: ${user.email}`);
    console.log(`📚 Topics: ${topics.length} total`);
    console.log(`🧠 Mindmap: ${mindmap.name}`);
    console.log('\n🔗 API Tests:');
    console.log('   http://localhost:3001/api/topics');
    console.log('   http://localhost:3001/api/topics/javascript-fundamentals');
    console.log('   http://localhost:3001/api/health/detailed');
    
    return {
      user,
      topics,
      mindmap
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Allow direct execution
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase, sampleTopics, sampleUser };