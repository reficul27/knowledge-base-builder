// src/app/page.tsx
import { BookOpen, Brain, TrendingUp, Clock, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { name: 'Topics Completed', value: '12', icon: BookOpen, color: 'text-green-600 bg-green-100' },
  { name: 'Active Mindmaps', value: '3', icon: Brain, color: 'text-blue-600 bg-blue-100' },
  { name: 'Learning Streak', value: '7 days', icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
  { name: 'Time Today', value: '45 min', icon: Clock, color: 'text-orange-600 bg-orange-100' },
]

const recentTopics = [
  {
    title: 'JavaScript Fundamentals',
    category: 'Programming',
    progress: 100,
    difficulty: 'Beginner',
    timeSpent: '3h 20m'
  },
  {
    title: 'React Components',
    category: 'Frontend',
    progress: 75,
    difficulty: 'Intermediate',
    timeSpent: '2h 15m'
  },
  {
    title: 'Node.js Basics',
    category: 'Backend',
    progress: 30,
    difficulty: 'Beginner',
    timeSpent: '45m'
  }
]

const quickActions = [
  {
    title: 'Start Learning',
    description: 'Continue your learning journey',
    href: '/topics',
    icon: BookOpen,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'Create Mindmap',
    description: 'Visualize your knowledge',
    href: '/mindmaps/new',
    icon: Brain,
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    title: 'Explore Topics',
    description: 'Discover new subjects',
    href: '/topics/explore',
    icon: Plus,
    color: 'bg-green-600 hover:bg-green-700'
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back! 👋
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-3 transition-colors`}
                  >
                    <action.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Learning */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Learning
                </h3>
                <Link
                  href="/topics"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <div
                    key={topic.title}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {topic.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {topic.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {topic.difficulty}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {topic.timeSpent}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {topic.progress}% complete
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}