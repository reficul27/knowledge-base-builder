// src/app/topics/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock, BookOpen, CheckCircle, PlayCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface TopicSection {
  id: string
  title: string
  content: string
  estimatedMinutes: number
}

interface Topic {
  id: string
  title: string
  slug: string
  description: string
  category: string
  difficulty: string
  estimatedDurationMinutes: number
  tags: string[]
  content: {
    summary: string
    keyConcepts: string[]
    sections: TopicSection[]
  }
  learningObjectives: string[]
  prerequisites: string[]
}

interface TopicResponse {
  success: boolean
  data: {
    topic: Topic
    relatedTopics: Array<{
      id: string
      title: string
      slug: string
      category: string
      difficulty: string
    }>
    prerequisites: any[]
  }
}

export default function TopicDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [topic, setTopic] = useState<Topic | null>(null)
  const [relatedTopics, setRelatedTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3001/api/topics/${slug}`)
        
        if (!response.ok) {
          throw new Error('Topic not found')
        }
        
        const data: TopicResponse = await response.json()
        
        if (data.success) {
          setTopic(data.data.topic)
          setRelatedTopics(data.data.relatedTopics)
          if (data.data.topic.content.sections.length > 0) {
            setActiveSection(data.data.topic.content.sections[0].id)
          }
        } else {
          throw new Error('Failed to load topic')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="py-8">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
            Topic not found
          </h3>
          <p className="mt-2 text-red-700 dark:text-red-300">
            {error}
          </p>
          <Link 
            href="/topics"
            className="mt-4 inline-flex items-center text-red-600 hover:text-red-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Topics
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/topics"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Topics
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {topic.description}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {topic.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {topic.difficulty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(topic.estimatedDurationMinutes / 60)}h {topic.estimatedDurationMinutes % 60}m
              </span>
            </div>
          </div>
          
          <div className="ml-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors">
              <PlayCircle className="h-5 w-5 mr-2" />
              Start Learning
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {topic.content.summary}
            </p>
          </div>

          {/* Learning Objectives */}
          {topic.learningObjectives && topic.learningObjectives.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Learning Objectives
              </h2>
              <ul className="space-y-3">
                {topic.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Concepts */}
          {topic.content.keyConcepts && topic.content.keyConcepts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Key Concepts
              </h2>
              <div className="flex flex-wrap gap-2">
                {topic.content.keyConcepts.map((concept) => (
                  <span
                    key={concept}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sections */}
          {topic.content.sections && topic.content.sections.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Content Sections
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {topic.content.sections.map((section, index) => (
                  <div key={section.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {section.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {section.estimatedMinutes} min
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Overall</span>
                  <span className="text-gray-900 dark:text-white font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Mark as Complete
              </button>
            </div>
          </div>

          {/* Related Topics */}
          {relatedTopics.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Topics
              </h3>
              <div className="space-y-3">
                {relatedTopics.slice(0, 5).map((relatedTopic) => (
                  <Link
                    key={relatedTopic.id}
                    href={`/topics/${relatedTopic.slug}`}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {relatedTopic.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {relatedTopic.category} • {relatedTopic.difficulty}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {topic.tags && topic.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}