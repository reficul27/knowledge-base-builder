// src/components/layout/Navbar.tsx
'use client'

import { Search, Bell, User, Settings, Brain } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center ml-2 md:mr-24">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Knowledge Base Builder
              </span>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search topics, concepts..."
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            <div className="flex items-center ml-3 space-x-3">
              {/* Notifications */}
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Settings */}
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* User Menu */}
              <button
                type="button"
                className="flex text-sm bg-blue-600 rounded-full focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
              >
                <User className="w-8 h-8 p-1 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}