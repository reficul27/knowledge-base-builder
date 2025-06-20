// src/app/mindmap/page.tsx - Interactive Learning Board View
import { ArrowLeft, Plus, Settings, Save, Home } from 'lucide-react'
import Link from 'next/link'
import InteractiveLearningBoard from '@/components/mindmap/InteractiveLearningBoard'

export default function MindmapPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Minimal Top Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
      </div>
      
      {/* Interactive Learning Board - Full Screen */}
      <div className="flex-1">
        <InteractiveLearningBoard />
      </div>
    </div>
  )
}