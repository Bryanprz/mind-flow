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
// Sidebar removed - now using shared ERB sidebar
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

  // Dashboard now works without habit plans

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
    <div className="w-full h-full bg-transparent relative">
      {/* Dashboard Content - no sidebar needed, using shared ERB sidebar */}
      
      {/* Mouse tracking indicator */}
      <div 
        className="fixed pointer-events-none z-50 transition-all duration-100"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      >
        <div className="w-5 h-5 bg-cyan-400/30 rounded-full border border-cyan-400/60 shadow-lg shadow-cyan-400/20"></div>
      </div>

      {/* Keyboard shortcuts help */}
      {keyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-6 right-6 bg-gray-900/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl z-50 border border-cyan-400/20"
        >
          <h3 className="font-semibold mb-3 text-white">Mission Control Shortcuts</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div><kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">F</kbd> Focus Boost</div>
            <div><kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">M</kbd> Meditation</div>
            <div><kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">E</kbd> Energy Boost</div>
            <div><kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-800 border border-cyan-400/30 text-cyan-400 px-2 py-1 rounded">/</kbd> Show Help</div>
          </div>
        </motion.div>
      )}
      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col relative z-10">
        {/* Header removed - now handled by ERB template */}

        {/* Main Dashboard Content */}
        <div className="w-full">
          {/* Dashboard Content */}
          <div className="w-full">
            {/* Cognitive Performance Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-4xl font-bold text-white tracking-wide mb-2">MISSION PERFORMANCE</h2>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1">Today</span>
                  <span className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">Week</span>
                  <span className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">Month</span>
                </div>
              </div>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 border border-gray-700/30 hover:border-cyan-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-cyan-400 text-lg">🧬</span>
                    </div>
                    <span className="text-xs text-gray-400 font-light tracking-wide uppercase">Focus Score</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">92%</div>
                  <div className="text-xs text-emerald-400 font-medium">↑ 8% from yesterday</div>
                </div>
                
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:shadow-purple-400/20 transition-all duration-300 border border-gray-700/30 hover:border-purple-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-purple-400 text-lg">🎯</span>
                    </div>
                    <span className="text-xs text-gray-400 font-light tracking-wide uppercase">Clarity Level</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">87%</div>
                  <div className="text-xs text-emerald-400 font-medium">↑ 5% from yesterday</div>
                </div>
                
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:shadow-amber-400/20 transition-all duration-300 border border-gray-700/30 hover:border-amber-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-amber-400 text-lg">⚡</span>
                    </div>
                    <span className="text-xs text-gray-400 font-light tracking-wide uppercase">Energy Reserves</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">74%</div>
                  <div className="text-xs text-amber-400 font-medium">↓ 12% from yesterday</div>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 h-80 transition-all duration-300">
                <StatisticsChart 
                  selectedDate="2024-01-15"
                  timeRange="1h"
                  timeInterval="1h"
                />
              </div>
            </div>

            {/* Active Sessions - Simplified */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">CURRENT SESSION</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">LIVE</span>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">🧠</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Deep Work Session</h3>
                      <p className="text-sm text-gray-300">High Focus • 92% Performance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">01:54:38</div>
                    <div className="text-xs text-gray-400">Session Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Components */}
          <div className="w-80 bg-black/40 backdrop-blur-sm p-6 space-y-6 h-full overflow-y-auto flex-shrink-0">
            {/* Focus Score Gauge */}
            <WellnessGauge currentUser={currentUser} />
            
            {/* Cognitive Metrics Chart */}
            <HabitChart habitPlan={null} />
          </div>
        </div>
      </div>
    </div>
  )
}