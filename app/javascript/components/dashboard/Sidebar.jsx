import React from 'react'
import { motion } from 'framer-motion'
import { Brain, BarChart3, Target, BookOpen, Bell, Settings, LogOut } from 'lucide-react'

export default function Sidebar({ currentUser }) {
  const menuItems = [
    { href: '/dashboard', icon: Brain, label: 'MindFlow', emoji: '🧠' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics', emoji: '📊' },
    { href: '/goals', icon: Target, label: 'Goals', emoji: '🎯' },
    { href: '/learning', icon: BookOpen, label: 'Learning', emoji: '📚' },
    { href: '/notifications', icon: Bell, label: 'Notifications', emoji: '🔔', badge: 2 },
    { href: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
    { href: '/logout', icon: LogOut, label: 'Logout', emoji: '🚪', isLogout: true },
  ]

  const handleLogout = (e) => {
    e.preventDefault()
    if (confirm('Are you sure you want to logout?')) {
      // Handle logout logic here
      window.location.href = '/logout'
    }
  }

  return (
    <div className="drawer-side" style={{ height: '100%', overflow: 'visible' }}>
      <label htmlFor="sidebar-toggle" className="drawer-overlay"></label>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 w-80 h-full flex flex-col">
        {/* MindFlow Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            MindFlow
          </h1>
          <p className="text-gray-400 text-sm mt-1">Cognitive Performance Hub</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isLogout = item.isLogout
              
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href={item.href} 
                    onClick={isLogout ? handleLogout : undefined}
                    data-turbo-method={isLogout ? "delete" : "get"}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
                      isLogout 
                        ? 'hover:bg-red-500/10 hover:text-red-400' 
                        : 'hover:bg-blue-500/10 hover:text-blue-400'
                    }`}
                  >
                    {/* Icon Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      isLogout ? 'bg-gray-700 group-hover:bg-red-500/20' : 'bg-gray-700 group-hover:bg-blue-500/20'
                    }`}>
                      {item.emoji}
                    </div>
                    
                    {/* Label */}
                    <span className="font-medium text-white group-hover:text-white">
                      {item.label}
                    </span>
                    
                    {/* Notification Badge */}
                    {item.badge && (
                      <div className="ml-auto">
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </a>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        {/* User Info */}
        {currentUser && (
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {currentUser.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{currentUser.name || 'User'}</p>
                <p className="text-gray-400 text-xs">Cognitive Optimizer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

