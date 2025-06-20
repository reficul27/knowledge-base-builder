// src/app/mindmap/page.tsx - Single Mindmap View
import { ArrowLeft, Plus, Settings, Save } from 'lucide-react'
import Link from 'next/link'
import MindmapCanvas from '@/components/mindmap/MindmapCanvas'

export default function MindmapPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning: JavaScript
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Plus className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mindmap Canvas */}
      <div className="flex-1 relative">
        <MindmapCanvas />
      </div>
      
      {/* Bottom Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>5 Topics</span>
            <span>8 Connections</span>
            <span>Last saved: 2 minutes ago</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Zoom: 100%</span>
            <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600">
              Fit to Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
