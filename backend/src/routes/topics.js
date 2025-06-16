// src/routes/topics.js - Finale Version mit MongoDB Integration
const express = require('express');
const mongoose = require('mongoose');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const Topic = require('../models/Topic');
const User = require('../models/User');

const router = express.Router();

// GET /api/topics - Get all topics with filtering and search
router.get('/', asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    search,
    tags,
    limit = 20,
    offset = 0,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query = { status: 'published' };
  
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tagArray };
  }

  let topicsQuery;

  if (search) {
    // Text search
    topicsQuery = Topic.searchTopics(search, query);
  } else {
    // Regular query
    topicsQuery = Topic.find(query);
  }

  // Apply sorting
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortObject = {};
  sortObject[sort] = sortOrder;
  
  topicsQuery = topicsQuery.sort(sortObject);

  // Apply pagination
  const topics = await topicsQuery
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .populate('authorId', 'profile.name email');

  // Get total count for pagination
  const total = await Topic.countDocuments(query);

  // Get available filter options
  const [categories, difficulties, availableTags] = await Promise.all([
    Topic.distinct('category', { status: 'published' }),
    Topic.distinct('difficulty', { status: 'published' }),
    Topic.distinct('tags', { status: 'published' })
  ]);

  res.json({
    success: true,
    data: {
      topics,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      },
      filters: {
        categories,
        difficulties,
        availableTags: availableTags.slice(0, 50) // Limit for performance
      }
    }
  });
}));

// GET /api/topics/:identifier - Get specific topic (by ID or slug)
router.get('/:identifier', asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  
  let topic;
  
  // Try to find by slug first
  topic = await Topic.findOne({ slug: identifier, status: 'published' })
    .populate('authorId', 'profile.name email');
    
  // If not found by slug and identifier looks like ObjectId, try by ID
  if (!topic && mongoose.Types.ObjectId.isValid(identifier)) {
    topic = await Topic.findById(identifier)
      .populate('authorId', 'profile.name email');
  }
  
  if (!topic) {
    throw new AppError('Topic not found', 404);
  }

  // Get related topics (same category, similar tags)
  const relatedTopics = await Topic.find({
    _id: { $ne: topic._id },
    status: 'published',
    $or: [
      { category: topic.category },
      { tags: { $in: topic.tags } }
    ]
  })
  .limit(5)
  .select('title slug category difficulty estimatedDurationMinutes tags stats.averageRating');

  // Get prerequisites
  const prerequisites = await Topic.find({
    slug: { $in: topic.prerequisites },
    status: 'published'
  }).select('title slug category difficulty estimatedDurationMinutes');

  res.json({
    success: true,
    data: {
      topic,
      relatedTopics,
      prerequisites,
      // TODO: Add user progress when authentication is implemented
      progress: null
    }
  });
}));

// POST /api/topics - Create new topic
router.post('/', asyncHandler(async (req, res) => {
  const topicData = req.body;
  
  // TODO: Add authentication middleware to get user ID
  // For now, use a placeholder
  topicData.authorId = '507f1f77bcf86cd799439011'; // Placeholder

  // Validate required fields
  const requiredFields = ['title', 'description', 'category', 'difficulty', 'estimatedDurationMinutes'];
  for (const field of requiredFields) {
    if (!topicData[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  // Create the topic
  const topic = new Topic(topicData);
  await topic.save();

  // TODO: Create corresponding Neo4j node
  
  res.status(201).json({
    success: true,
    data: {
      topic,
      message: 'Topic created successfully'
    }
  });
}));

// GET /api/topics/category/:category - Get topics by category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { difficulty, limit = 20, offset = 0 } = req.query;
  
  const query = { category, status: 'published' };
  if (difficulty) query.difficulty = difficulty;
  
  const topics = await Topic.find(query)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .select('title slug description difficulty estimatedDurationMinutes tags stats')
    .sort({ 'stats.averageRating': -1 });

  const total = await Topic.countDocuments(query);

  res.json({
    success: true,
    data: {
      topics,
      category,
      difficulty: difficulty || 'all',
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    }
  });
}));

// GET /api/topics/search/:query - Search topics
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query } = req.params;
  const { limit = 20, category, difficulty } = req.query;
  
  const filters = {};
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  
  const topics = await Topic.searchTopics(query, filters)
    .limit(parseInt(limit))
    .select('title slug description category difficulty estimatedDurationMinutes tags stats.averageRating');

  res.json({
    success: true,
    data: {
      topics,
      searchQuery: query,
      resultCount: topics.length
    }
  });
}));

module.exports = router;