// src/app/page.tsx - Simplified Dashboard
import { Brain, Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Knowledge Base Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start learning with interactive mindmaps
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            What do you want to learn today?
          </h2>
          
          <div className="space-y-4">
            {/* Topic Input */}
            <div>
              <input
                type="text"
                placeholder="e.g., JavaScript, React, Machine Learning..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white text-lg"
              />
            </div>
            
            {/* Start Button */}
            <Link
              href="/mindmap"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                       font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span>Start Learning Journey</span>
            </Link>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Web Development", topics: "HTML, CSS, JavaScript, React" },
            { title: "Data Science", topics: "Python, Pandas, Machine Learning" },
            { title: "DevOps", topics: "Docker, Kubernetes, CI/CD" }
          ].map((example) => (
            <Link
              key={example.title}
              href="/mindmap"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg
                       transition-shadow border border-gray-200 dark:border-gray-700
                       hover:border-blue-300 dark:hover:border-blue-600"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {example.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {example.topics}
              </p>
            </Link>
          ))}
        </div>

        {/* Simple Stats */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600 dark:text-gray-400">Topics Learned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-gray-600 dark:text-gray-400">Connections Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-gray-600 dark:text-gray-400">Hours Learned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
