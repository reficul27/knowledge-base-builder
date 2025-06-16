// src/app/settings/page.tsx
'use client'

import { useState } from 'react'
import { User, Bell, Palette, Shield, Database, Download, Trash2, Save } from 'lucide-react'

interface UserSettings {
  profile: {
    name: string
    email: string
    avatar: string
    timezone: string
    language: string
  }
  preferences: {
    learningStyle: 'visual' | 'textual' | 'interactive' | 'mixed'
    difficultyPreference: 'beginner' | 'intermediate' | 'advanced'
    dailyGoalMinutes: number
    theme: 'light' | 'dark' | 'auto'
    layoutDensity: 'compact' | 'comfortable' | 'spacious'
    mindmapStyle: 'force_directed' | 'hierarchical' | 'circular'
  }
  notifications: {
    emailEnabled: boolean
    pushEnabled: boolean
    learningReminders: boolean
    achievementAlerts: boolean
    weeklyReports: boolean
    reminderTime: string
  }
  privacy: {
    profileVisible: boolean
    statsVisible: boolean
    mindmapsDiscoverable: boolean
    allowCollaboration: boolean
  }
}

// Mock current settings - später aus API
const mockSettings: UserSettings = {
  profile: {
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: '',
    timezone: 'Europe/Berlin',
    language: 'en'
  },
  preferences: {
    learningStyle: 'visual',
    difficultyPreference: 'intermediate',
    dailyGoalMinutes: 30,
    theme: 'light',
    layoutDensity: 'comfortable',
    mindmapStyle: 'force_directed'
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: false,
    learningReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    reminderTime: '09:00'
  },
  privacy: {
    profileVisible: true,
    statsVisible: false,
    mindmapsDiscoverable: true,
    allowCollaboration: true
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy' | 'data'>('profile')
  const [hasChanges, setHasChanges] = useState(false)

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    // API call to save settings
    console.log('Saving settings:', settings)
    setHasChanges(false)
    // Show success message
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'data', name: 'Data & Export', icon: Database }
  ]

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage your account and learning preferences
          </p>
        </div>
        {hasChanges && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={saveSettings}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 ml-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timezone
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Europe/Berlin">Europe/Berlin</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language
                      </label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => updateSettings('profile', 'language', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Learning Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Learning Style
                      </label>
                      <select
                        value={settings.preferences.learningStyle}
                        onChange={(e) => updateSettings('preferences', 'learningStyle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="visual">Visual</option>
                        <option value="textual">Textual</option>
                        <option value="interactive">Interactive</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default Difficulty
                      </label>
                      <select
                        value={settings.preferences.difficultyPreference}
                        onChange={(e) => updateSettings('preferences', 'difficultyPreference', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Daily Learning Goal (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={settings.preferences.dailyGoalMinutes}
                        onChange={(e) => updateSettings('preferences', 'dailyGoalMinutes', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Theme
                      </label>
                      <select
                        value={settings.preferences.theme}
                        onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Layout Density
                      </label>
                      <select
                        value={settings.preferences.layoutDensity}
                        onChange={(e) => updateSettings('preferences', 'layoutDensity', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="compact">Compact</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mindmap Style
                      </label>
                      <select
                        value={settings.preferences.mindmapStyle}
                        onChange={(e) => updateSettings('preferences', 'mindmapStyle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="force_directed">Force Directed</option>
                        <option value="hierarchical">Hierarchical</option>
                        <option value="circular">Circular</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Notification Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive updates and reminders via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailEnabled}
                        onChange={(e) => updateSettings('notifications', 'emailEnabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Push Notifications
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Browser push notifications for real-time updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushEnabled}
                        onChange={(e) => updateSettings('notifications', 'pushEnabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Learning Reminders
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Daily reminders to continue your learning journey
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.learningReminders}
                        onChange={(e) => updateSettings('notifications', 'learningReminders', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Achievement Alerts
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notifications when you unlock achievements
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.achievementAlerts}
                        onChange={(e) => updateSettings('notifications', 'achievementAlerts', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Weekly Reports
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Weekly summary of your learning progress
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) => updateSettings('notifications', 'weeklyReports', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    {settings.notifications.learningReminders && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reminder Time
                        </label>
                        <input
                          type="time"
                          value={settings.notifications.reminderTime}
                          onChange={(e) => updateSettings('notifications', 'reminderTime', e.target.value)}
                          className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Privacy & Sharing
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Public Profile
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => updateSettings('privacy', 'profileVisible', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Public Statistics
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Show your learning stats on your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.statsVisible}
                        onChange={(e) => updateSettings('privacy', 'statsVisible', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Discoverable Mindmaps
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow others to discover your public mindmaps
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.mindmapsDiscoverable}
                        onChange={(e) => updateSettings('privacy', 'mindmapsDiscoverable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Allow Collaboration
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Let others invite you to collaborate on mindmaps
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowCollaboration}
                        onChange={(e) => updateSettings('privacy', 'allowCollaboration', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Export Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Data Management
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Export Your Data
                      </h4>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                        Download all your learning data, mindmaps, and progress in JSON format.
                      </p>
                      <div className="mt-3">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-200 hover:bg-blue-300">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                        Account Deletion
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-200">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <div className="mt-3">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-300">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Data Usage
                      </h4>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <div className="flex justify-between">
                          <span>Topics Created:</span>
                          <span>15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mindmaps:</span>
                          <span>3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Learning Sessions:</span>
                          <span>127</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Size:</span>
                          <span>2.3 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}