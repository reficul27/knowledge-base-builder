// src/app/my-brain/page.tsx - MINIMAL VERSION
'use client'

import { useState } from 'react'
import { Brain, Sparkles, BookOpen, Star } from 'lucide-react'

export default function MyBrainPage() {
  const [selectedTopic, setSelectedTopic] = useState('')

  const topics = [
    { id: 'html5', name: 'HTML5', category: 'frontend', mastery: 95, status: 'mastered' },
    { id: 'css3', name: 'CSS3', category: 'frontend', mastery: 90, status: 'mastered' },
    { id: 'javascript', name: 'JavaScript', category: 'programming', mastery: 88, status: 'mastered' },
    { id: 'react', name: 'React.js', category: 'frontend', mastery: 75, status: 'completed' },
    { id: 'python', name: 'Python', category: 'programming', mastery: 82, status: 'completed' }
  ]

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-3">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <span>My Brain</span>
              <Sparkles className="h-6 w-6" />
            </h1>
            <p className="text-blue-100 mt-1">Your knowledge network</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Topics</p>
              <p className="text-2xl font-bold text-gray-900">{topics.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mastered</p>
              <p className="text-2xl font-bold text-gray-900">
                {topics.filter(t => t.status === 'mastered').length}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mastery</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length)}%
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="flex items-start justify-between mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <div className={`${
                  topic.status === 'mastered' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {topic.status === 'mastered' ? <Star className="h-4 w-4" /> : <div className="w-4 h-4 bg-green-500 rounded-full" />}
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-1">{topic.name}</h3>
              <p className="text-sm text-gray-600 mb-2 capitalize">{topic.category}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    topic.mastery >= 90 ? 'bg-yellow-500' :
                    topic.mastery >= 70 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${topic.mastery}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-600 mt-1">
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
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">{topic.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{topic.category}</p>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  topic.status === 'mastered' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {topic.status === 'mastered' ? '★ Mastered' : '✓ Completed'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${topic.mastery}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{topic.mastery}% mastery level</p>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}