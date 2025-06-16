// src/models/Mindmap.js
const mongoose = require('mongoose');

const mindmapNodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  topicId: {
    type: String, // Topic slug
    required: true,
    ref: 'Topic'
  },
  position: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  size: {
    type: Number,
    min: 20,
    max: 200,
    default: 60
  },
  color: {
    type: String,
    default: '#2563eb',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  completionDate: Date,
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  unlockDate: Date,
  customLabel: String,
  notes: String
});

const mindmapEdgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['prerequisite', 'related', 'advanced', 'alternative'],
    default: 'related'
  },
  strength: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  style: {
    color: {
      type: String,
      default: '#666'
    },
    width: {
      type: Number,
      min: 1,
      max: 10,
      default: 2
    },
    dashed: {
      type: Boolean,
      default: false
    }
  },
  label: String
});

const collaboratorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permission: {
    type: String,
    enum: ['view', 'edit', 'admin'],
    default: 'view'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'node_added', 'node_removed', 'node_moved', 'node_completed',
      'edge_added', 'edge_removed', 'edge_modified',
      'mindmap_created', 'mindmap_renamed', 'mindmap_shared'
    ],
    required: true
  },
  target: String, // Node ID, Edge ID, etc.
  details: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const mindmapStatsSchema = new mongoose.Schema({
  totalNodes: {
    type: Number,
    default: 0
  },
  completedNodes: {
    type: Number,
    default: 0
  },
  inProgressNodes: {
    type: Number,
    default: 0
  },
  plannedNodes: {
    type: Number,
    default: 0
  },
  totalConnections: {
    type: Number,
    default: 0
  },
  learningTimeMinutes: {
    type: Number,
    default: 0
  },
  lastAccessed: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  complexityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  }
});

const mindmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Mindmap name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private',
    index: true
  },
  sharedWith: [collaboratorSchema],
  layout: {
    style: {
      type: String,
      enum: ['force_directed', 'hierarchical', 'circular', 'custom'],
      default: 'force_directed'
    },
    nodes: [mindmapNodeSchema],
    edges: [mindmapEdgeSchema]
  },
  stats: {
    type: mindmapStatsSchema,
    default: () => ({})
  },
  activityLog: [activityLogSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50
  }],
  template: {
    type: String,
    enum: ['custom', 'programming', 'language_learning', 'science', 'business'],
    default: 'custom'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  parentTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mindmap'
  }
}, {
  timestamps: true
});

// Indexes
mindmapSchema.index({ userId: 1, createdAt: -1 });
mindmapSchema.index({ visibility: 1 });
mindmapSchema.index({ 'sharedWith.userId': 1 });
mindmapSchema.index({ 'stats.lastAccessed': -1 });
mindmapSchema.index({ tags: 1 });
mindmapSchema.index({ isTemplate: 1 });

// Virtual for completion percentage
mindmapSchema.virtual('completionPercentage').get(function() {
  if (this.stats.totalNodes === 0) return 0;
  return Math.round((this.stats.completedNodes / this.stats.totalNodes) * 100);
});

// Instance methods
mindmapSchema.methods.toJSON = function() {
  const mindmap = this.toObject();
  mindmap.id = mindmap._id;
  delete mindmap._id;
  delete mindmap.__v;
  return mindmap;
};

mindmapSchema.methods.addNode = function(nodeData) {
  const nodeId = nodeData.id || `node_${Date.now()}`;
  const newNode = {
    id: nodeId,
    topicId: nodeData.topicId,
    position: nodeData.position,
    size: nodeData.size || 60,
    color: nodeData.color || '#2563eb',
    status: nodeData.status || 'not-started'
  };
  
  this.layout.nodes.push(newNode);
  this.updateStats();
  this.logActivity('node_added', nodeId, nodeData);
  
  return newNode;
};

mindmapSchema.methods.removeNode = function(nodeId) {
  const nodeIndex = this.layout.nodes.findIndex(node => node.id === nodeId);
  if (nodeIndex === -1) return false;
  
  // Remove the node
  this.layout.nodes.splice(nodeIndex, 1);
  
  // Remove any edges connected to this node
  this.layout.edges = this.layout.edges.filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  );
  
  this.updateStats();
  this.logActivity('node_removed', nodeId);
  
  return true;
};

mindmapSchema.methods.addEdge = function(edgeData) {
  const edgeId = edgeData.id || `edge_${Date.now()}`;
  const newEdge = {
    id: edgeId,
    source: edgeData.source,
    target: edgeData.target,
    type: edgeData.type || 'related',
    strength: edgeData.strength || 0.5,
    style: edgeData.style || {}
  };
  
  this.layout.edges.push(newEdge);
  this.updateStats();
  this.logActivity('edge_added', edgeId, edgeData);
  
  return newEdge;
};

mindmapSchema.methods.updateNodeStatus = function(nodeId, status, progressPercentage = null) {
  const node = this.layout.nodes.find(n => n.id === nodeId);
  if (!node) return false;
  
  const oldStatus = node.status;
  node.status = status;
  
  if (progressPercentage !== null) {
    node.progressPercentage = progressPercentage;
  }
  
  if (status === 'completed' && oldStatus !== 'completed') {
    node.completionDate = new Date();
  }
  
  this.updateStats();
  this.logActivity('node_completed', nodeId, { 
    oldStatus, 
    newStatus: status, 
    progressPercentage 
  });
  
  return true;
};

mindmapSchema.methods.updateStats = function() {
  const nodes = this.layout.nodes;
  const edges = this.layout.edges;
  
  this.stats.totalNodes = nodes.length;
  this.stats.completedNodes = nodes.filter(n => n.status === 'completed').length;
  this.stats.inProgressNodes = nodes.filter(n => n.status === 'in-progress').length;
  this.stats.plannedNodes = nodes.filter(n => n.status === 'not-started').length;
  this.stats.totalConnections = edges.length;
  
  // Calculate complexity score based on nodes and connections
  if (nodes.length > 0) {
    const connectionRatio = edges.length / nodes.length;
    this.stats.complexityScore = Math.min(1, (nodes.length * 0.1 + connectionRatio * 0.5) / 10);
  }
  
  this.stats.lastAccessed = new Date();
};

mindmapSchema.methods.logActivity = function(action, target, details = {}) {
  this.activityLog.push({
    userId: this.userId,
    action,
    target,
    details,
    timestamp: new Date()
  });
  
  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }
};

mindmapSchema.methods.addCollaborator = function(userId, permission = 'view', addedBy = null) {
  const existingCollaborator = this.sharedWith.find(
    collab => collab.userId.toString() === userId.toString()
  );
  
  if (existingCollaborator) {
    existingCollaborator.permission = permission;
    return existingCollaborator;
  }
  
  const newCollaborator = {
    userId,
    permission,
    addedBy: addedBy || this.userId,
    addedAt: new Date()
  };
  
  this.sharedWith.push(newCollaborator);
  this.logActivity('mindmap_shared', userId, { permission });
  
  return newCollaborator;
};

// Static methods
mindmapSchema.statics.findByUser = function(userId, includeShared = true) {
  const query = {
    $or: [
      { userId },
      ...(includeShared ? [{ 'sharedWith.userId': userId }] : [])
    ]
  };
  
  return this.find(query).sort({ 'stats.lastAccessed': -1 });
};

mindmapSchema.statics.findPublic = function(limit = 20) {
  return this.find({ visibility: 'public' })
    .sort({ 'stats.viewCount': -1, createdAt: -1 })
    .limit(limit);
};

mindmapSchema.statics.findTemplates = function() {
  return this.find({ isTemplate: true, visibility: 'public' })
    .sort({ 'stats.viewCount': -1 });
};

// Pre-save middleware
mindmapSchema.pre('save', function(next) {
  // Auto-update stats when layout changes
  if (this.isModified('layout')) {
    this.updateStats();
  }
  
  next();
});

const Mindmap = mongoose.model('Mindmap', mindmapSchema);

module.exports = Mindmap;