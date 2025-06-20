// src/app/page.tsx - Enhanced Dashboard
'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, BookOpen, Target, Trophy, ArrowRight, Play, Star, Clock, Zap, Brain } from 'lucide-react'
import Link from 'next/link'

interface QuickTopic {
  id: string;
  title: string;
  category: string;
  difficulty: 1 | 2 | 3;
  estimatedHours: number;
  description: string;
  trending?: boolean;
}

export default function Dashboard() {
  const [searchTopic, setSearchTopic] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch - only show animated stars after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Demo user stats
  const userStats = {
    level: 5,
    currentXP: 420,
    xpToNextLevel: 80,
    completedTopics: 12,
    learningStreak: 7,
    totalHours: 45
  }

  // Quick start topics
  const quickTopics: QuickTopic[] = [
    {
      id: 'web-development',
      title: 'Web Development',
      category: 'Frontend',
      difficulty: 1,
      estimatedHours: 40,
      description: 'Complete path from HTML to React',
      trending: true
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      category: 'AI/ML',
      difficulty: 3,
      estimatedHours: 60,
      description: 'ML fundamentals to advanced models'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      category: 'Security',
      difficulty: 2,
      estimatedHours: 35,
      description: 'Network security and ethical hacking',
      trending: true
    },
    {
      id: 'data-science',
      title: 'Data Science',
      category: 'Analytics',
      difficulty: 2,
      estimatedHours: 50,
      description: 'Data analysis with Python and R'
    }
  ]

  const handleTopicSearch = (topic: string) => {
    console.log(`Searching for topic: ${topic}`)
    window.location.href = '/mindmap'
  }

  const getDifficultyBadge = (difficulty: number) => {
    const badges = {
      1: { text: 'Beginner', color: 'bg-green-500', icon: '🌱' },
      2: { text: 'Intermediate', color: 'bg-yellow-500', icon: '🔥' },
      3: { text: 'Advanced', color: 'bg-red-500', icon: '💎' }
    }
    return badges[difficulty as keyof typeof badges]
  }

  // Static star positions to avoid hydration mismatch
  const starPositions = [
    { left: 10, top: 15, delay: 0.5, duration: 3 },
    { left: 85, top: 25, delay: 1.2, duration: 4 },
    { left: 25, top: 60, delay: 0.8, duration: 3.5 },
    { left: 75, top: 80, delay: 1.5, duration: 4.2 },
    { left: 45, top: 35, delay: 0.3, duration: 3.8 },
    { left: 90, top: 55, delay: 1.8, duration: 3.2 },
    { left: 15, top: 85, delay: 0.7, duration: 4.5 },
    { left: 65, top: 20, delay: 1.1, duration: 3.6 },
    { left: 35, top: 75, delay: 0.4, duration: 4.1 },
    { left: 80, top: 40, delay: 1.6, duration: 3.9 },
    { left: 20, top: 50, delay: 0.9, duration: 3.3 },
    { left: 55, top: 30, delay: 1.3, duration: 4.3 },
    { left: 95, top: 70, delay: 0.6, duration: 3.7 },
    { left: 5, top: 45, delay: 1.4, duration: 4.0 },
    { left: 70, top: 65, delay: 0.2, duration: 3.4 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated background - only show after mount */}
        {mounted && (
          <div className="absolute inset-0 opacity-20">
            {starPositions.map((star, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        )}

        <div className="relative px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-6 py-3">
                <BookOpen className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Knowledge Base Builder</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              What do you want to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                learn today?
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Build your personalized learning journey with our interactive mindmap system. 
              Track progress, unlock achievements, and master new skills step by step.
            </p>

            {/* Search Input */}
            <div className="mt-10 max-w-xl mx-auto relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTopic}
                  onChange={(e) => {
                    setSearchTopic(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTopic.trim()) {
                      handleTopicSearch(searchTopic)
                    }
                  }}
                  className="block w-full pl-11 pr-24 py-4 border-0 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 text-lg"
                  placeholder="Enter any topic... (e.g., React, Machine Learning, Cybersecurity)"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => searchTopic.trim() && handleTopicSearch(searchTopic)}
                    className="h-full px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-r-2xl hover:from-purple-600 hover:to-blue-600 transition-all font-medium"
                  >
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                  {['JavaScript Fundamentals', 'React Development', 'Node.js Backend', 'Python Data Science'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchTopic(suggestion)
                        setShowSuggestions(false)
                        handleTopicSearch(suggestion)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/mindmap"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-6 py-3 text-white hover:bg-white/20 transition-all"
              >
                <Play className="h-4 w-4" />
                <span>Continue Learning</span>
              </Link>
              <Link
                href="/my-brain"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-6 py-3 text-white hover:bg-white/20 transition-all"
              >
                <Brain className="h-4 w-4" />
                <span>Knowledge Map</span>
              </Link>
              <button className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-6 py-3 text-white hover:bg-white/20 transition-all">
                <Target className="h-4 w-4" />
                <span>Set Goals</span>
              </button>
              <button className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-6 py-3 text-white hover:bg-white/20 transition-all">
                <Trophy className="h-4 w-4" />
                <span>Achievements</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* User Progress Stats */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-purple-600" />
              Your Learning Progress
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Level Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Level</p>
                    <p className="text-3xl font-bold text-purple-600">{userStats.level}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all"
                      style={{ width: `${(userStats.currentXP / (userStats.currentXP + userStats.xpToNextLevel)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{userStats.xpToNextLevel} XP to next level</p>
                </div>
              </div>

              {/* Completed Topics */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Topics</p>
                    <p className="text-3xl font-bold text-green-600">{userStats.completedTopics}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                    <p className="text-3xl font-bold text-orange-600">{userStats.learningStreak}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Total Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hours</p>
                    <p className="text-3xl font-bold text-blue-600">{userStats.totalHours}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-600" />
              Quick Access
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Learning Board Card */}
              <Link
                href="/mindmap"
                className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Play className="w-8 h-8" />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2">Learning Board</h3>
                <p className="text-purple-100">Interactive game-like learning experience with achievements and progress tracking</p>
              </Link>

              {/* Knowledge Map Card */}
              <Link
                href="/my-brain"
                className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8" />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2">Knowledge Map</h3>
                <p className="text-indigo-100">Neural network visualization of your complete knowledge base and learning connections</p>
              </Link>

              {/* Analytics Card */}
              <button className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8" />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2">Learning Analytics</h3>
                <p className="text-emerald-100">Detailed insights into your learning patterns, progress, and achievements</p>
              </button>
            </div>
          </div>

          {/* Popular Learning Paths */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
              Popular Learning Paths
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickTopics.map((topic) => {
                const difficultyBadge = getDifficultyBadge(topic.difficulty)
                
                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer"
                    onClick={() => handleTopicSearch(topic.title)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {topic.title}
                          </h3>
                          {topic.trending && (
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              🔥 Trending
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {topic.estimatedHours}h
                          </span>
                          <span className="text-purple-600 font-medium">{topic.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`${difficultyBadge.color} rounded-full px-3 py-1 text-xs font-medium text-white flex items-center`}>
                          <span className="mr-1">{difficultyBadge.icon}</span>
                          {difficultyBadge.text}
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to start your learning journey?</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Join thousands of learners who are building their skills with our interactive learning platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/mindmap"
                  className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Learning</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/my-brain"
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all"
                >
                  <Brain className="h-5 w-5" />
                  <span>Explore Knowledge Map</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}