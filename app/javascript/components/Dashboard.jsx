import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboardStore } from '../stores/dashboardStore'
import HabitChart from './dashboard/HabitChart'
import WellnessGauge from './dashboard/WellnessGauge'
import StatisticsChart from './dashboard/StatisticsChart'

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
          className="fixed top-6 right-6 theme-glass-card p-6 shadow-2xl z-50 hover:theme-neon-glow"
        >
          <h3 className="font-semibold mb-3 theme-text-primary theme-subtitle">Mission Control Shortcuts</h3>
          <div className="space-y-2 text-sm theme-text-secondary">
            <div><kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">F</kbd> Focus Boost</div>
            <div><kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">M</kbd> Meditation</div>
            <div><kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">E</kbd> Energy Boost</div>
            <div><kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="theme-glass-card-sm text-cyan-400 px-2 py-1 rounded">/</kbd> Show Help</div>
          </div>
        </motion.div>
      )}
      {/* Main Content Area - Flex Layout with Right Sidebar */}
      <div className="w-full h-full flex relative z-10 p-6 gap-6 overflow-hidden">
        
        {/* Main Content Column */}
        <div className="flex-1 flex flex-col overflow-y-auto space-y-6">
          
          {/* Cognitive Performance Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold theme-title tracking-wide">COGNITIVE PERFORMANCE</h2>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1">Today</span>
                <span className="theme-text-accent hover:text-cyan-400 cursor-pointer transition-colors">Week</span>
                <span className="theme-text-accent hover:text-cyan-400 cursor-pointer transition-colors">Month</span>
              </div>
            </div>
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl flex items-center justify-center border border-cyan-400/40">
                    <span className="text-cyan-300 text-lg">🧬</span>
                  </div>
                  <span className="text-xs theme-text-accent font-light tracking-wide uppercase">Focus</span>
                </div>
                <div className="text-3xl font-bold theme-text-primary mb-1">92%</div>
                <div className="text-xs text-emerald-400 font-medium">↑ 8% from yesterday</div>
              </div>
              
              <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-purple-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center border border-purple-400/40">
                    <span className="text-purple-300 text-lg">🎯</span>
                  </div>
                  <span className="text-xs theme-text-accent font-light tracking-wide uppercase">Clarity</span>
                </div>
                <div className="text-3xl font-bold theme-text-primary mb-1">87%</div>
                <div className="text-xs text-emerald-400 font-medium">↑ 5% from yesterday</div>
              </div>
              
              <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-amber-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-amber-400/40">
                    <span className="text-amber-300 text-lg">⚡</span>
                  </div>
                  <span className="text-xs theme-text-accent font-light tracking-wide uppercase">Energy</span>
                </div>
                <div className="text-3xl font-bold theme-text-primary mb-1">74%</div>
                <div className="text-xs text-amber-400 font-medium">↓ 12% from yesterday</div>
              </div>
            </div>
            
            {/* Performance Chart */}
            <div className="theme-glass-card p-6">
              <StatisticsChart 
                selectedDate="2024-01-15"
                timeRange="1h"
                timeInterval="1h"
              />
            </div>
          </div>

          {/* Active Session */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold theme-title tracking-wide">CURRENT SESSION</h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse theme-status-optimal"></div>
                <span className="text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>
            
            <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🧠</div>
                  <div>
                    <h3 className="text-lg font-semibold theme-text-primary">Deep Work Session</h3>
                    <p className="text-sm theme-text-accent">High Focus • 92% Performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">01:54:38</div>
                  <div className="text-xs theme-text-accent">Session Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Secondary Components */}
        <div className="w-80 flex-shrink-0 space-y-3 overflow-y-auto">
          {/* Focus Score Gauge */}
          <div className="h-64">
            <WellnessGauge currentUser={currentUser} />
          </div>
          
          {/* Cognitive Metrics Chart */}
          <div className="h-64">
            <HabitChart habitPlan={null} />
          </div>
        </div>
      </div>
    </div>
  )
}