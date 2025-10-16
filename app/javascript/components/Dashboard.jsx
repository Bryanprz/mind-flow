import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboardStore } from '../stores/dashboardStore'
import CalendarCard from './dashboard/CalendarCard'
import AIChatCard from './dashboard/AIChatCard'
import SocialFeedCard from './dashboard/SocialFeedCard'
import StatsOverview from './dashboard/StatsOverview'
import HabitChart from './dashboard/HabitChart'
import WellnessGauge from './dashboard/WellnessGauge'
import MoodTimeline from './dashboard/MoodTimeline'
import StatisticsChart from './dashboard/StatisticsChart'
import { AlertTriangle, ClipboardList, MessageSquare, Users, CheckSquare, User, Phone, BarChart3, Bell, Settings, LogOut, Search, Globe, Wifi } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function Dashboard({ habitPlan, currentUser, sectionPresenters }) {
  const { setCurrentUser, setHabitPlan } = useDashboardStore()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false)
  const [activeSession, setActiveSession] = useState(null)

  useEffect(() => {
    if (currentUser) setCurrentUser(currentUser)
    if (habitPlan) setHabitPlan(habitPlan)
  }, [currentUser, habitPlan, setCurrentUser, setHabitPlan])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show shortcuts help
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        setKeyboardShortcuts(true)
        setTimeout(() => setKeyboardShortcuts(false), 3000)
      }
      
      // Quick actions
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault()
        // Focus boost action
        console.log('Focus boost activated!')
      }
      
      if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault()
        // Meditation mode
        console.log('Meditation mode activated!')
      }
      
      if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault()
        // Energy boost
        console.log('Energy boost activated!')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!habitPlan) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-base-200 flex items-center justify-center"
      >
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <motion.h2 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-title text-2xl justify-center mb-4"
            >
              <AlertTriangle className="h-12 w-12 text-warning" />
            </motion.h2>
            <h3 className="text-xl font-semibold mb-2 text-base-content">No Habit Plan Found</h3>
            <p className="text-base-content/70 mb-4">Please create a habit plan to access your Dashboard.</p>
            <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        </div>
      </motion.div>
    )
  }

  // Active Mind Sessions data
  const activeMindSessions = [
    {
      id: 35774,
      type: "Deep Work",
      icon: "🧠",
      duration: "01:54:38",
      focusScore: 92,
      breakthroughMoments: 3,
      energyLevel: "High",
      status: "active"
    },
    {
      id: 98745,
      type: "Meditation Practice", 
      icon: "🧘",
      duration: "00:45:12",
      focusScore: 88,
      breakthroughMoments: 1,
      energyLevel: "Calm",
      status: "active"
    },
    {
      id: 85427,
      type: "Learning Sprint",
      icon: "📚",
      duration: "02:15:30",
      focusScore: 85,
      breakthroughMoments: 2,
      energyLevel: "Focused",
      status: "active"
    }
  ]

  const upcomingSessions = [
    { type: "Creative Flow", icon: "🎨", time: "3:00 PM" },
    { type: "Physical Reset", icon: "🏃", time: "4:30 PM" }
  ]

  const recoveryProtocols = [
    { type: "Mindful Break", reason: "Meditation & breathing", time: "00:17", icon: "🧘" },
    { type: "Physical Reset", reason: "Movement & exercise", time: "00:19", icon: "🏃" },
    { type: "Creative Pause", reason: "Freeform thinking", time: "10:51", icon: "🎨" },
    { type: "Social Integration", reason: "Connection time", time: "30:42", icon: "👥" }
  ]

  const days = [
    { day: "01", label: "Sat" },
    { day: "02", label: "Sun" },
    { day: "03", label: "Mon" },
    { day: "04", label: "Tue" },
    { day: "05", label: "Wed" },
    { day: "06", label: "Thu" },
    { day: "07", label: "Fri" },
    { day: "08", label: "Sat" },
    { day: "09", label: "Sun" },
    { day: "10", label: "Mon", active: true },
    { day: "11", label: "Tue" },
    { day: "12", label: "Wed" },
    { day: "13", label: "Thu" }
  ]

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden m-0 p-0">
      {/* Mouse tracking indicator */}
      <div 
        className="fixed pointer-events-none z-50 transition-all duration-100"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      >
        <div className="w-5 h-5 bg-primary/20 rounded-full border border-primary/40"></div>
      </div>

      {/* Keyboard shortcuts help */}
      {keyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-4 right-4 bg-base-100 p-4 rounded-lg shadow-lg z-50 border border-primary/20"
        >
          <h3 className="font-semibold mb-2 text-base-content">Keyboard Shortcuts</h3>
          <div className="space-y-1 text-sm text-base-content/70">
            <div><kbd className="bg-base-200 px-1 rounded">Ctrl</kbd> + <kbd className="bg-base-200 px-1 rounded">F</kbd> Focus Boost</div>
            <div><kbd className="bg-base-200 px-1 rounded">Ctrl</kbd> + <kbd className="bg-base-200 px-1 rounded">M</kbd> Meditation</div>
            <div><kbd className="bg-base-200 px-1 rounded">Ctrl</kbd> + <kbd className="bg-base-200 px-1 rounded">E</kbd> Energy Boost</div>
            <div><kbd className="bg-base-200 px-1 rounded">Ctrl</kbd> + <kbd className="bg-base-200 px-1 rounded">/</kbd> Show Help</div>
          </div>
        </motion.div>
      )}
      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col">
        {/* Top Header */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-300" />
            <div className="flex items-center space-x-2">
              <div className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                12 of 15 on work
                <div className="flex -space-x-1 ml-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-700"></div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                2 on break
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-gray-200 font-medium">James Radcliffe</div>
              <div className="text-gray-400 text-sm">Admin</div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex min-h-0 h-full">
          {/* Left Content */}
          <div className="flex-1 p-6 overflow-y-auto min-w-0 h-full">
            {/* Cognitive Performance Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Performance Timeline</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-200 font-medium">Today</span>
                  <span className="text-gray-400">Week</span>
                  <span className="text-gray-400">Month</span>
                </div>
              </div>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-500 text-sm">🧬</span>
                    </div>
                    <span className="text-xs text-gray-400">Focus Score</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">92%</div>
                  <div className="text-xs text-green-600">↑ 8% from yesterday</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-purple-500 text-sm">🎯</span>
                    </div>
                    <span className="text-xs text-gray-400">Clarity Level</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">87%</div>
                  <div className="text-xs text-green-600">↑ 5% from yesterday</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-500 text-sm">⚡</span>
                    </div>
                    <span className="text-xs text-gray-400">Energy Reserves</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-200">74%</div>
                  <div className="text-xs text-orange-500">↓ 12% from yesterday</div>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="bg-gray-800 rounded-lg p-4 h-72 border border-gray-700">
                <StatisticsChart 
                  selectedDate="2024-01-15"
                  timeRange="1h"
                  timeInterval="1h"
                />
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Active Sessions</h2>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {activeMindSessions.map((session) => (
                  <motion.div 
                    key={session.id} 
                    className="bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden border border-gray-700"
                    whileHover={{ scale: 1.02, rotateY: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSession(activeSession === session.id ? null : session.id)}
                  >
                    {/* Interactive background gradient */}
                    <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
                      activeSession === session.id ? 'opacity-10' : ''
                    } ${
                      session.type === 'Deep Work' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                      session.type === 'Meditation Practice' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      'bg-gradient-to-br from-green-500 to-blue-600'
                    }`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <motion.span 
                            className="text-lg"
                            animate={{ 
                              rotate: activeSession === session.id ? [0, 10, -10, 0] : 0 
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {session.icon}
                          </motion.span>
                          <div>
                            <h3 className="font-semibold text-sm text-gray-200">{session.type}</h3>
                            <p className="text-xs text-gray-400">{session.energyLevel}</p>
                          </div>
                        </div>
                        <motion.span 
                          className="text-xs font-medium text-gray-200 bg-gray-700 px-2 py-1 rounded"
                          animate={{ 
                            backgroundColor: activeSession === session.id ? '#3b82f6' : '',
                            color: activeSession === session.id ? 'white' : ''
                          }}
                        >
                          {session.duration}
                        </motion.span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-base-content/60">Focus:</span>
                          <motion.span 
                            className="font-medium"
                            animate={{ 
                              color: session.focusScore > 90 ? '#10b981' : '#f59e0b'
                            }}
                          >
                            {session.focusScore}%
                          </motion.span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-base-content/60">Breakthroughs:</span>
                          <span className="font-medium">{session.breakthroughMoments}</span>
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {activeSession === session.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-base-300"
                        >
                          <div className="text-xs text-base-content/60">
                            <div className="mb-1">💡 Tips: {session.type === 'Deep Work' ? 'Try 25-min Pomodoro' : 
                              session.type === 'Meditation Practice' ? 'Focus on breathing' : 'Take regular breaks'}</div>
                            <div>🎯 Next goal: +5% focus</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Graph Components */}
          <div className="w-80 bg-gray-800 p-4 space-y-6 border-l border-gray-700 h-full overflow-y-auto flex-shrink-0">
            {/* Focus Score Gauge */}
            <WellnessGauge currentUser={currentUser} />
            
            {/* Cognitive Metrics Chart */}
            <HabitChart habitPlan={habitPlan} />
          </div>
        </div>
      </div>
    </div>
  )
}