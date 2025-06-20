'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, CheckCircle, Star, Clock, Users, BookOpen, Trophy, Zap, Target, ArrowRight, Award } from 'lucide-react';

interface LearningTopic {
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
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface LearningPath {
  from: string;
  to: string;
  completed: boolean;
}

const InteractiveLearningBoard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [playerPosition, setPlayerPosition] = useState<string>('html-basics');
  const [showAchievements, setShowAchievements] = useState(false);
  const [animatingPath, setAnimatingPath] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Demo Learning Path Data with Board Game Layout
  const topics: LearningTopic[] = [
    {
      id: 'html-basics',
      title: 'HTML Basics',
      description: 'Learn the fundamentals of HTML markup',
      category: 'Frontend',
      difficulty: 1,
      estimatedHours: 8,
      prerequisites: [],
      status: 'completed',
      progress: 100,
      xp: 150,
      position: { x: 120, y: 400 }
    },
    {
      id: 'css-fundamentals',
      title: 'CSS Fundamentals',
      description: 'Master styling and layouts with CSS',
      category: 'Frontend',
      difficulty: 1,
      estimatedHours: 12,
      prerequisites: ['html-basics'],
      status: 'completed',
      progress: 100,
      xp: 200,
      position: { x: 320, y: 300 }
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Basics',
      description: 'Programming fundamentals and DOM manipulation',
      category: 'Programming',
      difficulty: 2,
      estimatedHours: 20,
      prerequisites: ['html-basics', 'css-fundamentals'],
      status: 'in-progress',
      progress: 65,
      xp: 180,
      position: { x: 520, y: 200 }
    },
    {
      id: 'react-fundamentals',
      title: 'React Fundamentals',
      description: 'Component-based UI development',
      category: 'Framework',
      difficulty: 2,
      estimatedHours: 25,
      prerequisites: ['javascript-basics'],
      status: 'available',
      progress: 0,
      xp: 0,
      position: { x: 720, y: 150 }
    },
    {
      id: 'react-hooks',
      title: 'React Hooks',
      description: 'Modern React patterns and state management',
      category: 'Framework',
      difficulty: 3,
      estimatedHours: 15,
      prerequisites: ['react-fundamentals'],
      status: 'locked',
      progress: 0,
      xp: 0,
      position: { x: 920, y: 200 }
    },
    {
      id: 'nodejs-basics',
      title: 'Node.js Basics',
      description: 'Server-side JavaScript development',
      category: 'Backend',
      difficulty: 2,
      estimatedHours: 18,
      prerequisites: ['javascript-basics'],
      status: 'available',
      progress: 0,
      xp: 0,
      position: { x: 520, y: 400 }
    },
    {
      id: 'express-framework',
      title: 'Express Framework',
      description: 'Build web APIs with Express.js',
      category: 'Backend',
      difficulty: 2,
      estimatedHours: 20,
      prerequisites: ['nodejs-basics'],
      status: 'locked',
      progress: 0,
      xp: 0,
      position: { x: 720, y: 450 }
    },
    {
      id: 'database-design',
      title: 'Database Design',
      description: 'SQL and NoSQL database fundamentals',
      category: 'Backend',
      difficulty: 3,
      estimatedHours: 25,
      prerequisites: ['express-framework'],
      status: 'locked',
      progress: 0,
      xp: 0,
      position: { x: 920, y: 400 }
    }
  ];

  // Learning paths (connections between topics)
  const learningPaths: LearningPath[] = [
    { from: 'html-basics', to: 'css-fundamentals', completed: true },
    { from: 'css-fundamentals', to: 'javascript-basics', completed: true },
    { from: 'javascript-basics', to: 'react-fundamentals', completed: false },
    { from: 'react-fundamentals', to: 'react-hooks', completed: false },
    { from: 'javascript-basics', to: 'nodejs-basics', completed: false },
    { from: 'nodejs-basics', to: 'express-framework', completed: false },
    { from: 'express-framework', to: 'database-design', completed: false }
  ];

  // Achievements system
  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first topic',
      icon: '🎯',
      unlocked: true
    },
    {
      id: 'frontend-explorer',
      title: 'Frontend Explorer',
      description: 'Master HTML and CSS',
      icon: '🎨',
      unlocked: true
    },
    {
      id: 'javascript-warrior',
      title: 'JavaScript Warrior',
      description: 'Complete JavaScript Basics',
      icon: '⚡',
      unlocked: false
    },
    {
      id: 'full-stack-hero',
      title: 'Full-Stack Hero',
      description: 'Complete both frontend and backend paths',
      icon: '🦸',
      unlocked: false
    }
  ];

  // Calculate total progress and level
  const totalXP = topics.reduce((sum, topic) => sum + topic.xp, 0);
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const xpToNextLevel = ((currentLevel * 100) - totalXP);

  // Get topic status styling
  const getTopicStyling = (topic: LearningTopic) => {
    switch (topic.status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-green-500 to-green-600',
          border: 'border-green-400',
          shadow: 'shadow-green-500/25',
          text: 'text-white'
        };
      case 'in-progress':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          border: 'border-blue-400',
          shadow: 'shadow-blue-500/25',
          text: 'text-white'
        };
      case 'available':
        return {
          bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
          border: 'border-purple-400',
          shadow: 'shadow-purple-500/25',
          text: 'text-white'
        };
      case 'locked':
        return {
          bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
          border: 'border-gray-300',
          shadow: 'shadow-gray-500/25',
          text: 'text-gray-200'
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-400',
          shadow: 'shadow-gray-500/25',
          text: 'text-white'
        };
    }
  };

  // Get difficulty badge
  const getDifficultyBadge = (difficulty: number) => {
    const badges = {
      1: { text: 'Beginner', color: 'bg-green-500', icon: '🌱' },
      2: { text: 'Intermediate', color: 'bg-yellow-500', icon: '🔥' },
      3: { text: 'Advanced', color: 'bg-red-500', icon: '💎' }
    };
    return badges[difficulty as keyof typeof badges];
  };

  // Handle topic click
  const handleTopicClick = (topic: LearningTopic) => {
    if (topic.status === 'locked') return;
    
    setSelectedTopic(topic.id);
    
    if (topic.status === 'available') {
      // Animate path to this topic
      setAnimatingPath(topic.id);
      setTimeout(() => {
        setPlayerPosition(topic.id);
        setAnimatingPath(null);
      }, 1000);
    }
  };

  // Start learning session
  const startLearning = (topicId: string) => {
    // This would navigate to the learning session
    console.log(`Starting learning session for: ${topicId}`);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      </div>

      {/* Header Stats */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="flex justify-between items-center">
          {/* Player Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">Level {currentLevel}</div>
              <div className="text-white/80 text-sm">{totalXP} XP • {xpToNextLevel} to next level</div>
            </div>
          </div>

          {/* Achievements Button */}
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 text-white hover:bg-white/20 transition-all"
          >
            <Award className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full h-4 transition-all duration-500"
            style={{ width: `${(totalXP % 100)}%` }}
          />
        </div>
      </div>

      {/* Learning Board Canvas */}
      <div ref={canvasRef} className="relative w-full h-full pt-32 pb-8">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* Draw learning paths */}
          {learningPaths.map((path, index) => {
            const fromTopic = topics.find(t => t.id === path.from);
            const toTopic = topics.find(t => t.id === path.to);
            
            if (!fromTopic || !toTopic) return null;

            return (
              <g key={index}>
                {/* Path line */}
                <line
                  x1={fromTopic.position.x + 75}
                  y1={fromTopic.position.y + 40}
                  x2={toTopic.position.x + 75}
                  y2={toTopic.position.y + 40}
                  stroke={path.completed ? '#10B981' : '#6B7280'}
                  strokeWidth="4"
                  strokeDasharray={path.completed ? '0' : '8,8'}
                  className="drop-shadow-lg"
                />
                
                {/* Arrow */}
                <polygon
                  points={`${toTopic.position.x + 60},${toTopic.position.y + 35} ${toTopic.position.x + 60},${toTopic.position.y + 45} ${toTopic.position.x + 70},${toTopic.position.y + 40}`}
                  fill={path.completed ? '#10B981' : '#6B7280'}
                  className="drop-shadow-lg"
                />
              </g>
            );
          })}
        </svg>

        {/* Topic Cards */}
        {topics.map((topic) => {
          const styling = getTopicStyling(topic);
          const difficultyBadge = getDifficultyBadge(topic.difficulty);
          const isSelected = selectedTopic === topic.id;
          const isPlayerHere = playerPosition === topic.id;

          return (
            <div
              key={topic.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-105 ${
                isSelected ? 'scale-110 z-20' : 'z-10'
              }`}
              style={{
                left: topic.position.x,
                top: topic.position.y
              }}
              onClick={() => handleTopicClick(topic)}
            >
              {/* Topic Card */}
              <div
                className={`
                  w-40 h-28 rounded-2xl border-2 ${styling.bg} ${styling.border} 
                  shadow-xl ${styling.shadow} cursor-pointer p-4 relative overflow-hidden
                  ${topic.status === 'locked' ? 'cursor-not-allowed' : 'hover:shadow-2xl'}
                  ${animatingPath === topic.id ? 'animate-pulse' : ''}
                `}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
                </div>

                {/* Status Icon */}
                <div className="absolute top-2 right-2">
                  {topic.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-white drop-shadow-lg" />
                  )}
                  {topic.status === 'in-progress' && (
                    <Play className="w-5 h-5 text-white drop-shadow-lg" />
                  )}
                  {topic.status === 'available' && (
                    <Target className="w-5 h-5 text-white drop-shadow-lg animate-pulse" />
                  )}
                  {topic.status === 'locked' && (
                    <Lock className="w-5 h-5 text-gray-200 drop-shadow-lg" />
                  )}
                </div>

                {/* Content */}
                <div className={`${styling.text} relative z-10`}>
                  <h3 className="font-bold text-sm truncate">{topic.title}</h3>
                  <p className="text-xs opacity-90 mt-1 truncate">{topic.description}</p>
                  
                  {/* Progress bar for in-progress topics */}
                  {topic.status === 'in-progress' && (
                    <div className="mt-2 bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white rounded-full h-1.5 transition-all"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  )}

                  {/* XP and time */}
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {topic.xp} XP
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {topic.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className={`absolute bottom-2 left-2 ${difficultyBadge.color} rounded-full px-2 py-0.5 text-xs font-medium text-white flex items-center`}>
                  <span className="mr-1">{difficultyBadge.icon}</span>
                  {difficultyBadge.text}
                </div>

                {/* Player indicator */}
                {isPlayerHere && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                      <Star className="w-4 h-4 text-yellow-800" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30" onClick={() => setSelectedTopic(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const topic = topics.find(t => t.id === selectedTopic);
              if (!topic) return null;

              const styling = getTopicStyling(topic);
              const difficultyBadge = getDifficultyBadge(topic.difficulty);

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
                    <div className={`${difficultyBadge.color} rounded-full px-3 py-1 text-sm font-medium text-white flex items-center`}>
                      <span className="mr-1">{difficultyBadge.icon}</span>
                      {difficultyBadge.text}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{topic.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{topic.estimatedHours} hours</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <Zap className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{topic.xp || 250} XP</span>
                      </div>
                    </div>
                  </div>

                  {topic.progress > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{topic.progress}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-3 transition-all"
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => startLearning(topic.id)}
                      disabled={topic.status === 'locked'}
                      className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                        topic.status === 'locked'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {topic.status === 'completed' ? 'Review' : 
                       topic.status === 'in-progress' ? 'Continue' : 
                       topic.status === 'available' ? 'Start Learning' : 'Locked'}
                    </button>
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <div className="absolute top-32 right-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-80 z-20">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border ${
                  achievement.unlocked 
                    ? 'bg-white/20 border-yellow-400' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{achievement.icon}</span>
                  <div>
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-white/80' : 'text-white/40'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveLearningBoard;