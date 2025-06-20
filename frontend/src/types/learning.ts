// src/types/learning.ts - Type definitions for Learning System

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  estimatedHours: number;
  prerequisites: string[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  xp: number;
  icon?: string;
  position: { x: number; y: number };
  resources?: LearningResource[];
  tags?: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'book' | 'documentation' | 'interactive';
  url: string;
  description?: string;
  duration?: number; // in minutes
  rating?: number;
  difficulty?: 1 | 2 | 3;
  free: boolean;
}

export interface LearningPath {
  from: string;
  to: string;
  completed: boolean;
  type?: 'prerequisite' | 'recommended' | 'alternative';
  strength?: number; // 0-1
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward?: number;
  category?: 'progress' | 'streak' | 'mastery' | 'social';
}

export interface LearningSession {
  id: string;
  userId: string;
  topicId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in minutes
  progress: number; // 0-100
  completed: boolean;
  xpEarned: number;
  resourcesVisited: string[];
  notes?: string;
}

export interface UserLearningProfile {
  id: string;
  level: number;
  totalXP: number;
  completedTopics: string[];
  currentTopics: string[];
  interests: string[];
  learningGoals: LearningGoal[];
  preferredDifficulty: 1 | 2 | 3;
  learningStyle: 'visual' | 'reading' | 'kinesthetic' | 'auditory';
  achievements: string[];
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetTopics: string[];
  targetLevel?: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  completed: boolean;
}

export interface LearningBoardState {
  currentView: 'overview' | 'topic-detail' | 'learning-session';
  selectedTopic?: string;
  playerPosition: string;
  zoomLevel: number;
  viewportCenter: { x: number; y: number };
  showAchievements: boolean;
  showProgress: boolean;
  animatingPath?: string;
}

// API Response Types
export interface TopicsResponse {
  topics: LearningTopic[];
  total: number;
  hasMore: boolean;
  filters: {
    categories: string[];
    difficulties: number[];
    tags: string[];
  };
}

export interface LearningPathResponse {
  path: LearningTopic[];
  connections: LearningPath[];
  estimatedTotalHours: number;
  difficulty: 'mixed' | 1 | 2 | 3;
  completionRate: number;
}

export interface RecommendationsResponse {
  recommendations: {
    topic: LearningTopic;
    reason: string;
    confidence: number;
    type: 'next-step' | 'related' | 'skill-gap' | 'trending';
  }[];
  context: {
    userLevel: number;
    completedTopics: number;
    currentInterests: string[];
  };
}

// Event Types for Analytics
export interface LearningEvent {
  type: 'topic-started' | 'topic-completed' | 'resource-accessed' | 'achievement-unlocked' | 'goal-set' | 'streak-broken' | 'level-up';
  userId: string;
  timestamp: Date;
  data: Record<string, any>;
}

// UI Component Props
export interface LearningBoardProps {
  initialTopic?: string;
  readonly?: boolean;
  showAchievements?: boolean;
  onTopicSelect?: (topicId: string) => void;
  onStartLearning?: (topicId: string) => void;
  customLayout?: boolean;
}

export interface TopicCardProps {
  topic: LearningTopic;
  isSelected?: boolean;
  isPlayerHere?: boolean;
  onClick?: () => void;
  showProgress?: boolean;
  interactive?: boolean;
}

export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  variant?: 'linear' | 'circular' | 'radial';
  showPercentage?: boolean;
  animated?: boolean;
}

// Utility Types
export type TopicStatus = LearningTopic['status'];
export type DifficultyLevel = LearningTopic['difficulty'];
export type ResourceType = LearningResource['type'];
export type AchievementCategory = Achievement['category'];
export type LearningStyle = UserLearningProfile['learningStyle'];

// Constants
export const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Intermediate', 
  3: 'Advanced'
} as const;

export const DIFFICULTY_COLORS = {
  1: 'green',
  2: 'yellow',
  3: 'red'
} as const;

export const STATUS_COLORS = {
  'locked': 'gray',
  'available': 'purple',
  'in-progress': 'blue',
  'completed': 'green'
} as const;

export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 50;