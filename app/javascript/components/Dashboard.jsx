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

  // Mock data for the call center dashboard
  const ongoingCalls = [
    {
      id: 35774,
      name: "Sophia Hayes",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      duration: "01:54:38",
      calls: 34,
      timeSpent: "2h 45m",
      assignedUser: "David Barr",
      userCount: 2,
      status: "active"
    },
    {
      id: 98745,
      name: "Owen Darnell", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      duration: "01:54:38",
      calls: 10,
      timeSpent: "3h 10m",
      assignedUser: "Kilian Schönberger",
      userCount: 4,
      status: "active"
    },
    {
      id: 85427,
      name: "Emma Larkin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      duration: "01:51:43",
      calls: 29,
      timeSpent: "6h 29m",
      assignedUser: "Jörgen Petersen",
      userCount: 8,
      status: "active"
    }
  ]

  const startingCalls = [
    { name: "Liam Grayson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { name: "Mia Jennings", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face" }
  ]

  const breakUsers = [
    { name: "Jack Linton", reason: "Cigarette brake", time: "00:17", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
    { name: "Samuel Waters", reason: "Lunch break", time: "00:19", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face" },
    { name: "Henry Mercer", reason: "Lunch break", time: "10:51", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face" },
    { name: "Amelia Rowann", reason: "Cigarette brake", time: "30:42", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" }
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
        <div className="text-base-content font-bold text-lg">nixtio</div>
        
        {/* Navigation Icons */}
        <div className="flex flex-col space-y-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-content" />
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <BarChart3 className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <Users className="w-5 h-5 text-base-content/70" />
          </div>
          <div className="w-10 h-10 bg-base-100 rounded-full flex items-center justify-center hover:bg-base-200 transition-colors">
            <ClipboardList className="w-5 h-5 text-base-content/70" />
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
            {/* Statistics Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-6">Statistics</h2>
              
              {/* Date Navigation */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-base-content font-medium">Days</span>
                <span className="text-base-content/70">Weeks</span>
                <span className="text-base-content/70">Months</span>
              </div>
              
              {/* Date Picker */}
              <div className="flex space-x-2 mb-6">
                {days.map((day, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-full text-sm ${
                      day.active 
                        ? 'bg-primary text-primary-content' 
                        : 'bg-base-100 text-base-content hover:bg-base-200'
                    }`}
                  >
                    <div>{day.day}</div>
                    <div className="text-xs">{day.label}</div>
                  </button>
                ))}
              </div>
              
              {/* Line Graph Placeholder */}
              <div className="bg-base-100 rounded-lg p-6 h-64">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-4 text-sm">
                    <span className="text-base-content">1h</span>
                    <span className="text-base-content">2h</span>
                    <span className="text-base-content">3h</span>
                    <span className="text-base-content">4h</span>
                  </div>
                </div>
                <div className="h-32 bg-base-200 rounded flex items-center justify-center">
                  <span className="text-base-content/70">Line Graph: 7am - 10pm</span>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-base-content/70">
                  <span>7 am</span>
                  <span>10 am</span>
                  <span>1 pm</span>
                  <span>4 pm</span>
                  <span>7 pm</span>
                  <span>10 pm</span>
                </div>
              </div>
            </div>

            {/* Ongoing Calls Section */}
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-6">Ongoing Calls</h2>
              <div className="grid grid-cols-3 gap-4">
                {ongoingCalls.map((call) => (
                  <div key={call.id} className="bg-base-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <img src={call.avatar} alt={call.name} className="w-10 h-10 rounded-full" />
                      <div className="bg-primary text-primary-content px-2 py-1 rounded text-xs">
                        {call.duration}
                      </div>
                    </div>
                    
                    <h3 className="text-base-content font-medium mb-2">{call.name}</h3>
                    
                    <div className="flex items-center space-x-4 mb-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${call.status === 'active' ? 'bg-success' : 'bg-error'}`}></div>
                        <span className="text-base-content/80">{call.calls}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 text-base-content/70">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <span className="text-base-content/80">{call.timeSpent}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-base-content/70 mb-3">
                      {call.assignedUser} <span className="bg-base-200 px-1 rounded">{call.userCount}</span>
                    </div>
                    
                    <div className="flex space-x-1 mb-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-base-content/70">ID {call.id}</span>
                      <div className="flex space-x-2">
                        <Globe className="w-4 h-4 text-base-content/70" />
                        <Wifi className="w-4 h-4 text-base-content/70" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-base-300 p-6">
            {/* Starting Calls */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Starting calls</h2>
              <div className="space-y-2">
                {startingCalls.map((call, index) => (
                  <div key={index} className="bg-base-100 rounded-full px-4 py-3 flex items-center space-x-3 shadow-sm">
                    <img src={call.avatar} alt={call.name} className="w-8 h-8 rounded-full" />
                    <span className="text-base-content">{call.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Break Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-base-content mb-4">Break</h2>
              <div className="space-y-2">
                {breakUsers.map((user, index) => (
                  <div key={index} className="bg-base-100 rounded-full px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="text-base-content text-sm">{user.name}</div>
                        <div className="text-base-content/70 text-xs">{user.reason}</div>
                      </div>
                    </div>
                    <div className="bg-warning text-warning-content px-2 py-1 rounded text-xs font-bold">
                      {user.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outsourced Employees */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6">
              <div className="flex -space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-content rounded-full border-2 border-primary-content"></div>
                <div className="w-8 h-8 bg-primary-content rounded-full border-2 border-primary-content"></div>
                <div className="w-8 h-8 bg-primary-content rounded-full border-2 border-primary-content"></div>
              </div>
              <div className="text-3xl font-bold text-primary-content mb-2">+278k</div>
              <div className="text-primary-content text-sm">Outsourced employees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}