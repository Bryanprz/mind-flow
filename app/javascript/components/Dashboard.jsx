import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDashboardStore } from '../stores/dashboardStore'
import CalendarCard from './dashboard/CalendarCard'
import AIChatCard from './dashboard/AIChatCard'
import SocialFeedCard from './dashboard/SocialFeedCard'
import Sidebar from './dashboard/Sidebar'
import StatsOverview from './dashboard/StatsOverview'
import HabitChart from './dashboard/HabitChart'
import WellnessGauge from './dashboard/WellnessGauge'
import MoodTimeline from './dashboard/MoodTimeline'
import AuthenticatedFooter from './dashboard/AuthenticatedFooter'
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

  useEffect(() => {
    if (currentUser) setCurrentUser(currentUser)
    if (habitPlan) setHabitPlan(habitPlan)
  }, [currentUser, habitPlan, setCurrentUser, setHabitPlan])

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
    <div className="min-h-screen bg-base-200 flex">
      {/* Left Sidebar Navigation */}
      <div className="w-20 bg-base-300 flex flex-col items-center py-6 space-y-6">
        {/* Logo */}
        <div className="text-base-content font-bold text-lg">MindFlow</div>
        
        {/* Navigation Icons */}
        <div className="flex flex-col space-y-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <BarChart3 className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <span className="text-sm">🎯</span>
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <span className="text-sm">📚</span>
          </div>
          <div className="relative w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <Bell className="w-5 h-5 text-base-content/70" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-error-content font-bold">2</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <Settings className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <LogOut className="w-5 h-5 text-base-content/70" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-16 bg-base-300 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-base-content/70" />
            <div className="flex items-center space-x-2">
              <div className="bg-base-100 text-base-content px-3 py-1 rounded-full text-sm">
                12 of 15 on work
                <div className="flex -space-x-1 ml-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 bg-primary rounded-full border-2 border-base-100"></div>
                  ))}
                </div>
              </div>
              <div className="bg-base-100 text-base-content px-3 py-1 rounded-full text-sm">
                2 on break
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-base-content font-medium">James Radcliffe</div>
              <div className="text-base-content/70 text-sm">Admin</div>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex">
          {/* Left Content */}
          <div className="flex-1 p-6">
            {/* Cognitive Performance Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-base-content">Performance Timeline</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-base-content font-medium">Today</span>
                  <span className="text-base-content/70">Week</span>
                  <span className="text-base-content/70">Month</span>
                </div>
              </div>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-base-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-500 text-sm">🧠</span>
                    </div>
                    <span className="text-xs text-base-content/60">Focus Score</span>
                  </div>
                  <div className="text-2xl font-bold text-base-content">92%</div>
                  <div className="text-xs text-green-600">↑ 8% from yesterday</div>
                </div>
                
                <div className="bg-base-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-purple-500 text-sm">🎯</span>
                    </div>
                    <span className="text-xs text-base-content/60">Clarity Level</span>
                  </div>
                  <div className="text-2xl font-bold text-base-content">87%</div>
                  <div className="text-xs text-green-600">↑ 5% from yesterday</div>
                </div>
                
                <div className="bg-base-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-500 text-sm">⚡</span>
                    </div>
                    <span className="text-xs text-base-content/60">Energy Reserves</span>
                  </div>
                  <div className="text-2xl font-bold text-base-content">74%</div>
                  <div className="text-xs text-orange-500">↓ 12% from yesterday</div>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="bg-base-100 rounded-lg p-4 h-72">
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
                <h2 className="text-xl font-bold text-base-content">Active Sessions</h2>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {activeMindSessions.map((session) => (
                  <div key={session.id} className="bg-base-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{session.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm text-base-content">{session.type}</h3>
                          <p className="text-xs text-base-content/60">{session.energyLevel}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-base-content/80 bg-base-200 px-2 py-1 rounded">
                        {session.duration}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-base-content/60">Focus:</span>
                        <span className="font-medium">{session.focusScore}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-base-content/60">Breakthroughs:</span>
                        <span className="font-medium">{session.breakthroughMoments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 bg-base-300 p-4 space-y-6">
            {/* Performance Index */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-content mb-1">87</div>
              <div className="text-primary-content/80 text-sm">Performance Index</div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-base-content/80">Today's Focus</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Deep Work:</span>
                  <span className="font-medium">2h 15m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Meditation:</span>
                  <span className="font-medium">45m</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Learning:</span>
                  <span className="font-medium">1h 30m</span>
                </div>
              </div>
            </div>

            {/* Next Up */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-base-content/80">Next Up</h3>
              <div className="space-y-2">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="bg-base-100 rounded-lg px-3 py-2 flex items-center space-x-2">
                    <span className="text-sm">{session.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-base-content">{session.type}</div>
                      <div className="text-xs text-base-content/60">{session.time}</div>
                    </div>
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