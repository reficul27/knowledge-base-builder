// src/app/paths/page.tsx
'use client'

import { useState } from 'react'
import { Plus, MapPin, Clock, Users, Star, CheckCircle, Circle } from 'lucide-react'
import Link from 'next/link'

interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  enrolledUsers: number
  rating: number
  topics: Array<{
    id: string
    name: string
    completed: boolean
    estimated_minutes: number
  }>
  progress: number
  isEnrolled: boolean
}

// Mock data - später aus API
const mockPaths: LearningPath[] = [
  {
    id: '1',
    name: 'Frontend Development Mastery',
    description: 'Complete journey from HTML basics to advanced React patterns',
    difficulty: 'beginner',
    estimatedHours: 120,
    enrolledUsers: 1250,
    rating: 4.8,
    progress: 65,
    isEnrolled: true,
    topics: [
      { id: '1', name: 'HTML5 Fundamentals', completed: true, estimated_minutes: 180 },
      { id: '2', name: 'CSS3 & Responsive Design', completed: true, estimated_minutes: 240 },
      { id: '3', name: 'JavaScript ES6+', completed: true, estimated_minutes: 300 },
      { id: '4', name: 'React Components', completed: false, estimated_minutes: 240 },
      { id: '5', name: 'State Management', completed: false, estimated_minutes: 180 },
      { id: '6', name: 'Testing & Deployment', completed: false, estimated_minutes: 120 }
    ]
  },
  {
    id: '2',
    name: 'Backend API Development',
    description: 'Build scalable APIs with Node.js, databases, and cloud deployment',
    difficulty: 'intermediate',
    estimatedHours: 90,
    enrolledUsers: 890,
    rating: 4.6,
    progress: 0,
    isEnrolled: false,
    topics: [
      { id: '7', name: 'Node.js Fundamentals', completed: false, estimated_minutes: 240 },
      { id: '8', name: 'Express.js Framework', completed: false, estimated_minutes: 180 },
      { id: '9', name: 'Database Design', completed: false, estimated_minutes: 200 },
      { id: '10', name: 'Authentication & Security', completed: false, estimated_minutes: 160 },
      { id: '11', name: 'API Testing', completed: false, estimated_minutes: 120 }
    ]
  },
  {
    id: '3',
    name: 'DevOps & Cloud Engineering',
    description: 'Master containerization, CI/CD, and cloud infrastructure',
    difficulty: 'advanced',
    estimatedHours: 150,
    enrolledUsers: 567,
    rating: 4.9,
    progress: 0,
    isEnrolled: false,
    topics: [
      { id: '12', name: 'Docker & Containerization', completed: false, estimated_minutes: 300 },
      { id: '13', name: 'Kubernetes Orchestration', completed: false, estimated_minutes: 400 },
      { id: '14', name: 'CI/CD Pipelines', completed: false, estimated_minutes: 240 },
      { id: '15', name: 'Cloud Platforms (AWS/Azure)', completed: false, estimated_minutes: 360 },
      { id: '16', name: 'Monitoring & Logging', completed: false, estimated_minutes: 180 }
    ]
  }
]

export default function LearningPathsPage() {
  const [paths] = useState<LearningPath[]>(mockPaths)
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all')

  const filteredPaths = paths.filter(path => {
    if (filter === 'enrolled') return path.isEnrolled
    if (filter === 'available') return !path.isEnrolled
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Paths
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Structured learning journeys to master new skills
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Path
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Paths', count: paths.length },
            { key: 'enrolled', label: 'My Paths', count: paths.filter(p => p.isEnrolled).length },
            { key: 'available', label: 'Available', count: paths.filter(p => !p.isEnrolled).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 rounded-full py-0.5 px-2.5 text-xs font-medium">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    <Link href={`/paths/${path.id}`} className="hover:text-blue-600">
                      {path.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {path.description}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {path.estimatedHours}h
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {path.enrolledUsers.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(path.rating)}
                  <span className="ml-1">{path.rating}</span>
                </div>
              </div>

              {/* Progress (if enrolled) */}
              {path.isEnrolled && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{path.progress}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Topics Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Topics ({path.topics.length})
                </h4>
                <div className="space-y-2">
                  {path.topics.slice(0, 3).map((topic) => (
                    <div key={topic.id} className="flex items-center space-x-2 text-sm">
                      {topic.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={topic.completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}>
                        {topic.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({Math.round(topic.estimated_minutes / 60)}h)
                      </span>
                    </div>
                  ))}
                  {path.topics.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{path.topics.length - 3} more topics
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {path.isEnrolled ? (
                  <Link
                    href={`/paths/${path.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Link>
                ) : (
                  <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Enroll in Path
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPaths.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No learning paths found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filter === 'enrolled' 
              ? "You haven't enrolled in any learning paths yet."
              : "No learning paths match your current filter."
            }
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first learning path
            </button>
          </div>
        </div>
      )}
    </div>
  )
}