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
import { AlertTriangle, ClipboardList, MessageSquare, Users, CheckSquare, User } from 'lucide-react'

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
            <h3 className="text-xl font-semibold mb-2">No Habit Plan Found</h3>
            <p className="text-gray-600 mb-4">Please create a habit plan to access your Dashboard.</p>
            <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col pt-16">
      {/* Mobile drawer */}
      <div className="lg:hidden drawer w-full flex-1">
        <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="p-8 sm:p-8 md:p-4 flex-1">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 md:space-y-4 lg:space-y-5"
            >
              {/* Stats Overview - Cognitive metrics */}
              <motion.div variants={itemVariants}>
                <StatsOverview habitPlan={habitPlan} currentUser={currentUser} />
              </motion.div>

              {/* Focus Gauge & Cognitive Chart */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 flex-shrink-0"
              >
                <WellnessGauge currentUser={currentUser} />
                <HabitChart habitPlan={habitPlan} />
              </motion.div>

              {/* Mood Timeline - Full width, impressive */}
              <motion.div variants={itemVariants}>
                <MoodTimeline currentUser={currentUser} />
              </motion.div>

              {/* Habits Tracker & AI Coach */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 lg:flex-1 lg:min-h-0 min-h-[400px] md:min-h-[500px] dashboard-grid"
              >
                <CalendarCard habitPlan={habitPlan} sectionPresenters={sectionPresenters} />
                <AIChatCard />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Sidebar currentUser={currentUser} />
      </div>

      {/* Desktop flex layout */}
      <div className="hidden lg:flex w-full flex-1">
        {/* Fixed Sidebar */}
        <div className="w-80 bg-base-200 flex-shrink-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ul className="menu p-4 text-base-content">
              <li><a href="/habit_plan" className="flex items-center gap-2"><ClipboardList className="w-4 h-4" />Habit Plan</a></li>
              <li><a href="/messages" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />Messages</a></li>
              <li><a href="/community" className="flex items-center gap-2"><Users className="w-4 h-4" />Community</a></li>
              <li><a href="/habit_logs" className="flex items-center gap-2"><CheckSquare className="w-4 h-4" />Check Ins</a></li>
              {currentUser && <li><a href={`/users/${currentUser.slug}`} className="flex items-center gap-2"><User className="w-4 h-4" />Profile</a></li>}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 sm:p-8 md:p-4">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 md:space-y-4 lg:space-y-5"
              >
                {/* Stats Overview - Cognitive metrics */}
                <motion.div variants={itemVariants}>
                  <StatsOverview habitPlan={habitPlan} currentUser={currentUser} />
                </motion.div>

                {/* Focus Gauge & Cognitive Chart */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 flex-shrink-0"
                >
                  <WellnessGauge currentUser={currentUser} />
                  <HabitChart habitPlan={habitPlan} />
                </motion.div>

                {/* Mood Timeline - Full width, impressive */}
                <motion.div variants={itemVariants}>
                  <MoodTimeline currentUser={currentUser} />
                </motion.div>

                {/* Habits Tracker & AI Coach */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 min-h-[400px] md:min-h-[500px] dashboard-grid"
                >
                  <CalendarCard habitPlan={habitPlan} sectionPresenters={sectionPresenters} />
                  <AIChatCard />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Now at the same level as main content and sidebar */}
      <AuthenticatedFooter currentUser={currentUser} />
    </div>
  )
}
