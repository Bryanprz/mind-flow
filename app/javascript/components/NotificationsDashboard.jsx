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
        className={`theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 ${
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
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">{notification.title}</h3>
                <p className="text-cyan-400 mb-2">{notification.message}</p>
                <p className="text-cyan-300 text-sm">{notification.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {notification.unread && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
                <button className="text-cyan-300 hover:text-cyan-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="theme-glass-card-sm text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors hover:theme-neon-glow">
                View Details
              </button>
              {notification.unread && (
                <button className="theme-glass-card-sm text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors hover:theme-neon-glow">
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
        <h3 className="text-purple-300 font-semibold">{title}</h3>
        <p className="text-purple-400 text-sm">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={settings[setting]}
          onChange={() => onChange(setting, !settings[setting])}
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
      </label>
    </div>
  )

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="w-full h-full bg-transparent relative">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-transparent z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">COMMUNICATION HUB</h1>
            <p className="text-cyan-400 text-sm">Stay updated with your cognitive journey</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="theme-glass-card-sm px-4 py-2 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
            <span className="text-cyan-300 text-sm font-medium">Unread: {unreadCount}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 theme-glass-card-sm text-cyan-300 rounded-lg font-semibold transition-all duration-200 hover:theme-neon-glow"
          >
            <Settings className="w-5 h-5" />
            Settings
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="w-full h-full flex pt-20 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            opacity: 1,
            overflow: 'scroll'
          }}
          className="w-full h-full flex flex-col p-6 space-y-6"
        >

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-medium">Unread</p>
                <p className="text-3xl font-bold text-cyan-300">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Today</p>
                <p className="text-3xl font-bold text-emerald-300">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-emerald-400/30">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-purple-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-purple-300">12</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-6 min-h-[80px]">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[56px] ${
                  selectedFilter === filter.key
                    ? 'theme-glass-card-sm text-cyan-300 border border-cyan-400/30'
                    : 'theme-glass-card-sm text-cyan-400 hover:theme-neon-glow'
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
            <h2 className="text-2xl font-bold text-cyan-300">
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
        <motion.div variants={itemVariants} className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-purple-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-300">NOTIFICATION PREFERENCES</h2>
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
          
          <div className="mt-6 pt-6 border-t border-purple-400/30">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="theme-glass-card-sm text-purple-300 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:theme-neon-glow"
            >
              Save Preferences
            </motion.button>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
