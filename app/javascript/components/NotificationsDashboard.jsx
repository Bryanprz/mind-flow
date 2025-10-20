import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  CheckCircle, 
  X, 
  Settings, 
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Clock,
  Star,
  Target,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Info,
  Award,
  Zap
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export default function NotificationsDashboard({ notificationsData }) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState({})

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Focus Session Complete",
        message: "Great job! You achieved 89% focus score.",
        time: "5 minutes ago",
        type: "success",
        unread: true,
        icon: CheckCircle
      },
      {
        id: 2,
        title: "Goal Milestone Reached",
        message: "You're 80% complete with your meditation goal!",
        time: "1 hour ago",
        type: "achievement",
        unread: true,
        icon: Award
      },
      {
        id: 3,
        title: "Weekly Report Ready",
        message: "Your cognitive performance report is available.",
        time: "1 day ago",
        type: "info",
        unread: false,
        icon: TrendingUp
      },
      {
        id: 4,
        title: "New Course Available",
        message: "Advanced Focus Techniques course is now available.",
        time: "2 days ago",
        type: "course",
        unread: false,
        icon: BookOpen
      }
    ]

    const mockSettings = {
      focus_reminders: true,
      goal_milestones: true,
      weekly_reports: true,
      course_updates: false,
      email_notifications: true
    }

    setNotifications(mockNotifications)
    setSettings(mockSettings)
  }, [])

  const filters = [
    { key: 'all', label: 'All Notifications', icon: Bell },
    { key: 'unread', label: 'Unread', icon: Eye },
    { key: 'success', label: 'Success', icon: CheckCircle },
    { key: 'achievement', label: 'Achievements', icon: Award },
    { key: 'info', label: 'Info', icon: Info }
  ]

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return notification.unread
    return notification.type === selectedFilter
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'achievement': return Award
      case 'info': return Info
      case 'course': return BookOpen
      default: return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-400 bg-emerald-500/20'
      case 'achievement': return 'text-amber-400 bg-amber-500/20'
      case 'info': return 'text-cyan-400 bg-cyan-500/20'
      case 'course': return 'text-purple-400 bg-purple-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type)
    return (
      <motion.div
        variants={itemVariants}
        className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 ${
          notification.unread ? 'ring-2 ring-cyan-400/20' : ''
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{notification.title}</h3>
                <p className="text-gray-300 mb-2">{notification.message}</p>
                <p className="text-gray-400 text-sm">{notification.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {notification.unread && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
                <button className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
              {notification.unread && (
                <button className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const SettingToggle = ({ title, description, setting, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={settings[setting]}
          onChange={() => onChange(setting, !settings[setting])}
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
      </label>
    </div>
  )

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="w-full h-full bg-transparent relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full min-h-full flex flex-col p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">COMMUNICATION HUB</h1>
              <p className="text-cyan-400 text-sm">Stay updated with your cognitive journey</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/30">
              <span className="text-white text-sm">Unread: {unreadCount}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-cyan-400/20"
            >
              <Settings className="w-5 h-5" />
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-medium">Unread</p>
                <p className="text-3xl font-bold text-white">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Today</p>
                <p className="text-3xl font-bold text-white">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-400/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedFilter === filter.key
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            )
          })}
        </motion.div>

        {/* Notifications List */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">
              {selectedFilter === 'unread' ? 'UNREAD NOTIFICATIONS' : 'ALL NOTIFICATIONS'}
            </h2>
          </div>
          
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">NOTIFICATION PREFERENCES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SettingToggle
                title="Focus Reminders"
                description="Daily focus session reminders"
                setting="focus_reminders"
                onChange={handleSettingChange}
              />
              <SettingToggle
                title="Goal Milestones"
                description="Achievement notifications"
                setting="goal_milestones"
                onChange={handleSettingChange}
              />
              <SettingToggle
                title="Weekly Reports"
                description="Performance summaries"
                setting="weekly_reports"
                onChange={handleSettingChange}
              />
            </div>
            
            <div className="space-y-4">
              <SettingToggle
                title="Course Updates"
                description="New content and courses"
                setting="course_updates"
                onChange={handleSettingChange}
              />
              <SettingToggle
                title="Email Notifications"
                description="Receive notifications via email"
                setting="email_notifications"
                onChange={handleSettingChange}
              />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700/30">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Save Preferences
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
