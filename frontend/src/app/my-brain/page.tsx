// src/app/my-brain/page.tsx
'use client'

import { useState } from 'react'
import { Brain, Sparkles, BookOpen, Star, Target, CheckCircle } from 'lucide-react'

export default function MyBrainPage() {
  const [selectedTopic, setSelectedTopic] = useState('')

  const topics = [
    { id: 'html5', name: 'HTML5', category: 'frontend', mastery: 95, status: 'mastered', session: 'Web Development' },
    { id: 'css3', name: 'CSS3', category: 'frontend', mastery: 90, status: 'mastered', session: 'Web Development' },
    { id: 'javascript', name: 'JavaScript', category: 'programming', mastery: 88, status: 'mastered', session: 'Web Development' },
    { id: 'react', name: 'React.js', category: 'frontend', mastery: 75, status: 'completed', session: 'Web Development' },
    { id: 'git', name: 'Git & GitHub', category: 'devops', mastery: 92, status: 'mastered', session: 'Developer Tools' },
    { id: 'docker', name: 'Docker', category: 'devops', mastery: 78, status: 'completed', session: 'Developer Tools' },
    { id: 'python', name: 'Python', category: 'programming', mastery: 82, status: 'completed', session: 'Data Science' },
    { id: 'pandas', name: 'Pandas', category: 'data-science', mastery: 68, status: 'completed', session: 'Data Science' }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      'frontend': '#10b981',
      'programming': '#3b82f6', 
      'devops': '#8b5cf6',
      'data-science': '#06b6d4'
    }
    return colors[category as keyof typeof colors] || '#6b7280'
  }

  const totalTopics = topics.length
  const masteredTopics = topics.filter(t => t.status === 'mastered').length
  const averageMastery = Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / totalTopics)

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <span>My Brain</span>
                <Sparkles className="h-6 w-6" />
              </h1>
              <p className="text-blue-100 mt-1">Your complete knowledge network</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{averageMastery}%</div>
            <div className="text-sm text-blue-100">Average Mastery</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Topics</p>
              <p className="text-2xl font-bold text-gray-900">{totalTopics}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">{masteredTopics} mastered</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Knowledge Areas</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Across 3 sessions</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mastery Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageMastery}%</p>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${averageMastery}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connections</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm font-bold">⚡</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Cross-domain</span>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedTopic === topic.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(topic.category) }}
                />
                <div className={`${
                  topic.status === 'mastered' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {topic.status === 'mastered' ? 
                    <Star className="h-4 w-4 fill-current" /> : 
                    <CheckCircle className="h-4 w-4" />
                  }
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-1">{topic.name}</h3>
              <p className="text-sm text-gray-600 mb-2 capitalize">{topic.session}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    topic.mastery >= 90 ? 'bg-yellow-500' :
                    topic.mastery >= 70 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${topic.mastery}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-600">
                {topic.mastery}% mastery
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Topic Details */}
      {selectedTopic && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Topic Details</h3>
          {(() => {
            const topic = topics.find(t => t.id === selectedTopic)
            if (!topic) return null
            
            return (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{topic.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{topic.category} • {topic.session}</p>
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  topic.status === 'mastered' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {topic.status === 'mastered' ? '★ Mastered' : '✓ Completed'}
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Mastery Level</span>
                    <span className="font-medium">{topic.mastery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        topic.mastery >= 90 ? 'bg-yellow-500' :
                        topic.mastery >= 70 ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Knowledge Goals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Knowledge Goals</h3>
        
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Complete Data Science Track</span>
            </div>
            <div className="text-xs text-blue-700">3 more topics to go</div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Reach 90% Average Mastery</span>
            </div>
            <div className="text-xs text-orange-700">Currently at {averageMastery}%</div>
            <div className="mt-2 w-full bg-orange-200 rounded-full h-1">
              <div className="bg-orange-600 h-1 rounded-full" style={{ width: `${(averageMastery/90)*100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}