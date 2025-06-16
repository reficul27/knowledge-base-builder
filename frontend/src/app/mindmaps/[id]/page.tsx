// src/app/mindmaps/[id]/page.tsx (Fixed Guided Learning Version)
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, CheckCircle, Lock, Star, Clock, Users, BookOpen } from 'lucide-react'
import { MindmapCanvas } from '@/components/mindmap/MindmapCanvas'

interface Node {
  id: string
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completed: boolean
  unlocked: boolean
  description?: string
  estimatedMinutes?: number
  resources?: Resource[]
  prerequisites?: string[]
}

interface Resource {
  id: string
  title: string
  type: 'video' | 'article' | 'documentation' | 'exercise'
  url: string
  duration: number
  rating: number
}

interface Link {
  source: string
  target: string
  type: 'prerequisite' | 'related' | 'advanced'
  strength: number
}

interface LearningPath {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  data: {
    nodes: Node[]
    links: Link[]
  }
  progress: {
    completedTopics: number
    currentTopic: string | null
    totalTopics: number
    completionPercentage: number
  }
}

// Mock learning path with progression logic
const mockLearningPath: LearningPath = {
  id: '1',
  name: 'Web Development Fundamentals',
  description: 'Master the building blocks of modern web development',
  category: 'frontend',
  difficulty: 'beginner',
  estimatedHours: 40,
  progress: {
    completedTopics: 2,
    currentTopic: 'javascript',
    totalTopics: 8,
    completionPercentage: 25
  },
  data: {
    nodes: [
      {
        id: 'html',
        name: 'HTML5',
        category: 'frontend',
        difficulty: 'beginner',
        completed: true,
        unlocked: true,
        description: 'Structure web content with semantic HTML5',
        estimatedMinutes: 180,
        prerequisites: []
      },
      {
        id: 'css',
        name: 'CSS3',
        category: 'frontend',
        difficulty: 'beginner',
        completed: true,
        unlocked: true,
        description: 'Style and layout with modern CSS3',
        estimatedMinutes: 240,
        prerequisites: ['html']
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        category: 'programming',
        difficulty: 'intermediate',
        completed: false,
        unlocked: true,
        description: 'Dynamic programming for interactive web apps',
        estimatedMinutes: 300,
        prerequisites: ['html', 'css']
      },
      {
        id: 'responsive',
        name: 'Responsive Design',
        category: 'frontend',
        difficulty: 'intermediate',
        completed: false,
        unlocked: false,
        description: 'Create layouts that work on all devices',
        estimatedMinutes: 180,
        prerequisites: ['css']
      },
      {
        id: 'react',
        name: 'React.js',
        category: 'frontend',
        difficulty: 'intermediate',
        completed: false,
        unlocked: false,
        description: 'Component-based UI development',
        estimatedMinutes: 240,
        prerequisites: ['javascript']
      },
      {
        id: 'api',
        name: 'REST APIs',
        category: 'backend',
        difficulty: 'intermediate',
        completed: false,
        unlocked: false,
        description: 'Connect to backend services',
        estimatedMinutes: 200,
        prerequisites: ['javascript']
      },
      {
        id: 'deployment',
        name: 'Deployment',
        category: 'devops',
        difficulty: 'intermediate',
        completed: false,
        unlocked: false,
        description: 'Deploy your applications to the web',
        estimatedMinutes: 120,
        prerequisites: ['react', 'api']
      },
      {
        id: 'optimization',
        name: 'Performance',
        category: 'frontend',
        difficulty: 'advanced',
        completed: false,
        unlocked: false,
        description: 'Optimize for speed and user experience',
        estimatedMinutes: 180,
        prerequisites: ['react', 'deployment']
      }
    ],
    links: [
      { source: 'html', target: 'css', type: 'prerequisite', strength: 0.9 },
      { source: 'html', target: 'javascript', type: 'prerequisite', strength: 0.8 },
      { source: 'css', target: 'responsive', type: 'prerequisite', strength: 0.9 },
      { source: 'css', target: 'react', type: 'prerequisite', strength: 0.7 },
      { source: 'javascript', target: 'react', type: 'prerequisite', strength: 0.9 },
      { source: 'javascript', target: 'api', type: 'prerequisite', strength: 0.8 },
      { source: 'react', target: 'deployment', type: 'prerequisite', strength: 0.8 },
      { source: 'api', target: 'deployment', type: 'prerequisite', strength: 0.7 },
      { source: 'deployment', target: 'optimization', type: 'prerequisite', strength: 0.8 },
      { source: 'responsive', target: 'optimization', type: 'related', strength: 0.6 }
    ]
  }
}

export default function GuidedLearningPath() {
  const params = useParams()
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLearningPath(mockLearningPath)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleNodeClick = (node: Node) => {
    if (node.unlocked) {
      setSelectedNode(node)
    }
  }

  const handleNodeDoubleClick = (node: Node) => {
    if (node.unlocked) {
      // Start learning this topic
      console.log('Start learning:', node.id)
    }
  }

  const handleCompleteCurrentTopic = () => {
    if (!learningPath || !learningPath.progress.currentTopic) return

    setLearningPath(prev => {
      if (!prev) return prev

      const updatedNodes = prev.data.nodes.map(node => {
        if (node.id === prev.progress.currentTopic) {
          return { ...node, completed: true }
        }
        return node
      })

      // Find next topic to unlock
      const completedIds = updatedNodes.filter(n => n.completed).map(n => n.id)
      const nextUnlockedNodes = updatedNodes.map(node => {
        if (node.unlocked || node.completed) return node
        
        // Check if all prerequisites are completed
        const allPrereqsCompleted = node.prerequisites?.every(prereq => 
          completedIds.includes(prereq)
        ) ?? true
        
        return { ...node, unlocked: allPrereqsCompleted }
      })

      // Find next current topic
      const nextCurrentTopic = nextUnlockedNodes.find(n => 
        n.unlocked && !n.completed
      )?.id || null

      return {
        ...prev,
        data: { ...prev.data, nodes: nextUnlockedNodes },
        progress: {
          ...prev.progress,
          completedTopics: completedIds.length,
          currentTopic: nextCurrentTopic,
          completionPercentage: Math.round((completedIds.length / prev.data.nodes.length) * 100)
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Learning path not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The learning path you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/paths"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Paths
          </Link>
        </div>
      </div>
    )
  }

  const currentTopic = learningPath.data.nodes.find(n => n.id === learningPath.progress.currentTopic)

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/paths"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Learning Paths
          </Link>
        </div>
      </div>

      {/* Learning Path Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">{learningPath.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                learningPath.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                learningPath.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {learningPath.difficulty}
              </span>
            </div>
            <p className="mt-2 text-blue-100">{learningPath.description}</p>
            
            <div className="mt-4 flex items-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {learningPath.estimatedHours} hours
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {learningPath.progress.totalTopics} topics
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                4.8 rating
              </div>
            </div>
          </div>
          
          <div className="ml-6 text-right">
            <div className="text-3xl font-bold">{learningPath.progress.completionPercentage}%</div>
            <div className="text-sm text-blue-100">Complete</div>
            <div className="mt-2 w-32 bg-blue-500 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${learningPath.progress.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Learning Path Visualization */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Learning Path Map</h3>
              <div className="text-sm text-gray-500">
                {learningPath.progress.completedTopics} of {learningPath.progress.totalTopics} completed
              </div>
            </div>
            
            <div style={{ height: '600px' }}>
              <MindmapCanvas
                data={learningPath.data}
                width={800}
                height={600}
                onNodeClick={handleNodeClick}
                onNodeDoubleClick={handleNodeDoubleClick}
                selectedNodeId={selectedNode?.id}
                currentActiveNode={learningPath.progress.currentTopic || undefined}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Topic */}
          {currentTopic && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Play className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-medium text-amber-900">Up Next</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{currentTopic.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{currentTopic.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estimated time:</span>
                  <span className="font-medium text-gray-900">{currentTopic.estimatedMinutes} min</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    currentTopic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    currentTopic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentTopic.difficulty}
                  </span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Link
                    href={`/learning/${currentTopic.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Link>
                  
                  <button 
                    onClick={handleCompleteCurrentTopic}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Topic Details */}
          {selectedNode && selectedNode.id !== learningPath.progress.currentTopic && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                {selectedNode.completed && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                {!selectedNode.unlocked && <Lock className="h-5 w-5 text-gray-400 mr-2" />}
                Topic Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedNode.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedNode.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedNode.completed ? 'bg-green-100 text-green-800' : 
                    selectedNode.unlocked ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedNode.completed ? 'Completed' : 
                     selectedNode.unlocked ? 'Available' : 'Locked'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Difficulty:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    selectedNode.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    selectedNode.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedNode.difficulty}
                  </span>
                </div>
                
                {selectedNode.estimatedMinutes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Est. Time:</span>
                    <span className="text-sm text-gray-900">{selectedNode.estimatedMinutes} min</span>
                  </div>
                )}

                {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Prerequisites:</span>
                    <div className="mt-1 space-y-1">
                      {selectedNode.prerequisites.map(prereqId => {
                        const prereq = learningPath.data.nodes.find(n => n.id === prereqId)
                        return prereq ? (
                          <div key={prereqId} className="flex items-center space-x-2 text-sm">
                            {prereq.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className={prereq.completed ? 'text-green-700' : 'text-gray-600'}>
                              {prereq.name}
                            </span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  {selectedNode.unlocked ? (
                    <Link
                      href={`/learning/${selectedNode.id}`}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {selectedNode.completed ? 'Review Topic' : 'Start Learning'}
                    </Link>
                  ) : (
                    <div className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                      <Lock className="h-4 w-4 mr-2" />
                      Complete Prerequisites
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Learning Progress */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{learningPath.progress.completedTopics}/{learningPath.progress.totalTopics}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${learningPath.progress.completionPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {learningPath.data.nodes.filter(n => n.completed).length}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {learningPath.data.nodes.filter(n => n.unlocked && !n.completed).length}
                  </div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-400">
                    {learningPath.data.nodes.filter(n => !n.unlocked).length}
                  </div>
                  <div className="text-xs text-gray-500">Locked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {currentTopic && (
                <Link
                  href={`/learning/${currentTopic.id}`}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Link>
              )}
              
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                View All Resources
              </button>
              
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Download Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}