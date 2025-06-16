// src/components/layout/Sidebar.tsx (Updated mit My Brain)
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Brain, 
  BookOpen, 
  Map, 
  BarChart3, 
  Settings, 
  User,
  Sparkles
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Brain', href: '/my-brain', icon: Brain },
  { name: 'Topics', href: '/topics', icon: BookOpen },
  { name: 'Learning Sessions', href: '/mindmaps', icon: Map },
  { name: 'Learning Paths', href: '/paths', icon: Sparkles },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4">
        <Brain className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-lg font-semibold text-gray-900">Knowledge Base</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.name === 'My Brain' && (
                        <span className="ml-auto inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          NEW
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          {/* User Section */}
          <li className="-mx-6 mt-auto">
            <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 border-t border-gray-200">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span className="sr-only">Your profile</span>
              <div className="flex-1">
                <div className="text-sm font-medium">Demo User</div>
                <div className="text-xs text-gray-500">Free Plan</div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}