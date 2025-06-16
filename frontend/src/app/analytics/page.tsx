// src/app/analytics/page.tsx
'use client'

import { useState } from 'react'
import { TrendingUp, Clock, BookOpen, Target, Calendar, Award, Brain, Users } from 'lucide-react'

interface AnalyticsData {
  learningTime: {
    today: number
    thisWeek: number
    thisMonth: number
    total: number
  }
  topics: {
    completed: number
    inProgress: number
    planned: number
  }
  streak: {
    current: number
    longest: number
  }
  weeklyActivity: Array<{
    day: string
    minutes: number
  }>
  topCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    earnedAt: string
    icon: string
  }>
}

// Mock data - später aus API
const mockAnalytics: AnalyticsData = {
  learningTime: {
    today: 45,
    thisWeek: 320,
    thisMonth: 1480,
    total: 12600
  },
  topics: {
    completed: 23,
    inProgress: 5,
    planned: 12
  },
  streak: {
    current: 7,
    longest: 15
  },
  weeklyActivity: [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 75 },
    { day: 'Fri', minutes: 40 },
    { day: 'Sat', minutes: 90 },
    { day: 'Sun', minutes: 55 }
  ],
  topCategories: [
    { category: 'Programming', count: 15, percentage: 45 },
    { category: 'Frontend', count: 8, percentage: 24 },
    { category: 'Backend', count: 6, percentage: 18 },
    { category: 'DevOps', count: 4, percentage: 13 }
  ],
  achievements: [
    {
      id: '1',
      name: 'First Steps',
      description: 'Completed your first topic',
      earnedAt: '2025-05-15',
      icon: '🎯'
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintained a 7-day learning streak',
      earnedAt: '2025-06-01',
      icon: '🔥'
    },
    {
      id: '3',
      name: 'Knowledge Collector',
      description: 'Completed 20 topics',
      earnedAt: '2025-06-10',
      icon: '📚'
    }
  ]
}

export default function AnalyticsPage() {
  const [analytics] = useState<AnalyticsData>(mockAnalytics)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week')

  const maxActivity = Math.max(...analytics.weeklyActivity.map(d => d.minutes))

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Track your progress and learning patterns
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Learning Time Today
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.learningTime.today}m
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Topics Completed
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.topics.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Current Streak
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.streak.current} days
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Hours
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {Math.round(analytics.learningTime.total / 60)}h
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h3>
            <div className="space-y-3">
              {analytics.weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center">
                  <div className="w-12 text-sm text-gray-500 dark:text-gray-400">
                    {day.day}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.minutes / maxActivity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-right text-gray-900 dark:text-white">
                    {day.minutes}m
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Learning Categories
            </h3>
            <div className="space-y-4">
              {analytics.topCategories.map((category, index) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} topics ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-green-600' :
                        index === 2 ? 'bg-yellow-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Learning Progress Overview
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.topics.completed}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completed Topics
              </div>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.topics.inProgress}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                In Progress
              </div>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.topics.planned}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Planned Topics
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Recent Achievements
          </h3>
          <div className="space-y-4">
            {analytics.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Award className="h-4 w-4 mr-2" />
              View All Achievements
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}