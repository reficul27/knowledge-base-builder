// src/models/Topic.js
const mongoose = require('mongoose');

const topicSectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  estimatedMinutes: {
    type: Number,
    min: 1,
    max: 300,
    default: 15
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }]
});

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'frontend', 'backend', 'devops', 'data-science', 'design', 'mobile', 'security'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    index: true
  },
  estimatedDurationMinutes: {
    type: Number,
    required: true,
    min: [5, 'Duration must be at least 5 minutes'],
    max: [600, 'Duration cannot exceed 600 minutes']
  },
  prerequisites: [{
    type: String, // Topic slugs
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Prerequisite must be a valid topic slug'
    }
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  content: {
    summary: {
      type: String,
      required: true,
      maxlength: 2000
    },
    keyConcepts: [{
      type: String,
      trim: true
    }],
    sections: [topicSectionSchema]
  },
  completionCriteria: {
    requiredSections: [String],
    quizPassingScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    practicalExercises: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  stats: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalTimeSpentMinutes: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50
  }],
  searchKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  publishedAt: Date
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for performance
topicSchema.index({ slug: 1 }, { unique: true });
topicSchema.index({ category: 1, difficulty: 1 });
topicSchema.index({ tags: 1 });
topicSchema.index({ 'stats.completionRate': -1 });
topicSchema.index({ createdAt: -1 });
topicSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  'content.summary': 'text'
});

// Virtual for Neo4j node ID
topicSchema.virtual('graphId').get(function() {
  return this.slug;
});

// Pre-save middleware to generate slug if not provided
topicSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Instance methods
topicSchema.methods.toJSON = function() {
  const topic = this.toObject();
  topic.id = topic._id;
  delete topic._id;
  delete topic.__v;
  return topic;
};

topicSchema.methods.calculateCompletionRate = async function() {
  // This would be implemented with user progress data
  // For now, return current value
  return this.stats.completionRate;
};

// Static methods
topicSchema.statics.findByCategory = function(category, difficulty = null) {
  const query = { category, status: 'published' };
  if (difficulty) query.difficulty = difficulty;
  return this.find(query).sort({ 'stats.averageRating': -1 });
};

topicSchema.statics.searchTopics = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'published',
    ...filters
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

topicSchema.statics.getTopicsByDifficulty = function(difficulty) {
  return this.find({ 
    difficulty, 
    status: 'published' 
  }).sort({ 'stats.averageRating': -1 });
};

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;