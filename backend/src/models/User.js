// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  profile: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    },
    lastLogin: Date
  },
  preferences: {
    learningStyle: {
      type: String,
      enum: ['visual', 'textual', 'interactive', 'mixed'],
      default: 'mixed'
    },
    difficultyPreference: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  stats: {
    totalLearningTimeMinutes: {
      type: Number,
      default: 0
    },
    topicsCompleted: {
      type: Number,
      default: 0
    },
    learningStreakDays: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });

// Instance methods
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.passwordHash;
  return user;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.createUser = async function(userData) {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  return this.create({
    email: userData.email,
    passwordHash: hashedPassword,
    profile: {
      name: userData.name,
      timezone: userData.timezone || 'UTC',
      language: userData.language || 'en'
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;