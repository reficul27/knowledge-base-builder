// src/app/mindmap/page.tsx - Interactive Learning Board View
'use client'

import { ArrowLeft, Plus, Settings, Save, Home, Brain, Eye, BookOpen, Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import InteractiveLearningBoard from '@/components/mindmap/InteractiveLearningBoard'

export default function MindmapPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') // explore, review, discovery
  const topic = searchParams.get('topic')
  const related = searchParams.get('related')

  // Get mode-specific styling and info
  const getModeInfo = () => {
    switch (mode) {
      case 'explore':
        return {
          icon: <Eye className="w-4 h-4" />,
          title: 'Explore Mode',
          subtitle: topic ? `Exploring: ${topic}` : 'Deep dive exploration',
          color: 'from-blue-500 to-cyan-500'
        }
      case 'review':
        return {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'Review Mode',
          subtitle: topic ? `Reviewing: ${topic}` : 'Knowledge reinforcement',
          color: 'from-green-500 to-emerald-500'
        }
      case 'discovery':
        return {
          icon: <Search className="w-4 h-4" />,
          title: 'Discovery Mode',
          subtitle: related ? `Related to: ${related}` : 'Find new connections',
          color: 'from-purple-500 to-violet-500'
        }
      default:
        return {
          icon: <Plus className="w-4 h-4" />,
          title: 'Learning Board',
          subtitle: 'Interactive learning workspace',
          color: 'from-indigo-500 to-purple-500'
        }
    }
  }

  const modeInfo = getModeInfo()

  return (
    <div className="h-screen flex flex-col">
      {/* Enhanced Top Navigation with Mode Indicator */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="flex justify-between items-center">
          {/* Back Navigation */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Mode Indicator */}
            <div className={`bg-gradient-to-r ${modeInfo.color} rounded-xl px-4 py-2 text-white flex items-center space-x-2`}>
              {modeInfo.icon}
              <div>
                <div className="text-sm font-medium">{modeInfo.title}</div>
                <div className="text-xs opacity-90">{modeInfo.subtitle}</div>
              </div>
            </div>
          </div>

          {/* Quick Navigation to Knowledge Archive */}
          <Link
            href="/my-brain"
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all"
          >
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Knowledge Archive</span>
          </Link>
        </div>
      </div>
      
      {/* Interactive Learning Board - Full Screen */}
      <div className="flex-1">
        <InteractiveLearningBoard />
      </div>
    </div>
  )
}