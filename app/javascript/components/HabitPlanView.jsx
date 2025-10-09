import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createRoot } from 'react-dom/client'
import { Calendar, Target, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { useHabitCompletion } from '../hooks/useHabitCompletion'
import HabitSection from './habit-plan/HabitSection'
import ProgressRing from './habit-plan/ProgressRing'
import StreakDisplay from './habit-plan/StreakDisplay'
import DateNavigator from './habit-plan/DateNavigator'
import JournalEditor from './habit-plan/JournalEditor'
import CompletionCelebration from './habit-plan/CompletionCelebration'
import WeeklyHeatmap from './habit-plan/WeeklyHeatmap'
import AIRecommendations from './habit-plan/AIRecommendations'
import DailyInsights from './habit-plan/DailyInsights'
import HabitScheduleBuilder from './habit-plan/HabitScheduleBuilder'
import WeeklyTrendsChart from './habit-plan/WeeklyTrendsChart'

export default function HabitPlanView({ 
  habitPlan, 
  habitLog, 
  date,
  sectionPresenters = []
}) {
  const [isDayCompleted, setIsDayCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentDate, setCurrentDate] = useState(date)
  
  // Initialize completions from habit log
  const initialCompletions = {}
  if (habitLog?.plan_item_logs) {
    habitLog.plan_item_logs.forEach(log => {
      if (log.completed_at) {
        initialCompletions[log.plan_item_id] = true
      }
    })
  }

  const {
    habitLogId,
    setHabitLogId,
    completions,
    toggleCompletion,
    isCompleted,
    getCompletionCount,
    getTotalCount,
    getCompletionPercentage,
    isUpdating
  } = useHabitCompletion(habitLog?.id, initialCompletions)

  // Update habit log ID when prop changes
  useEffect(() => {
    if (habitLog?.id) {
      setHabitLogId(habitLog.id)
    }
  }, [habitLog?.id, setHabitLogId])

  // Check if day is completed
  useEffect(() => {
    const total = getTotalCount()
    const completed = getCompletionCount()
    const wasCompleted = isDayCompleted
    const nowCompleted = total > 0 && completed === total
    
    setIsDayCompleted(nowCompleted)
    
    // Show celebration if just completed
    if (!wasCompleted && nowCompleted) {
      setShowCelebration(true)
    }
  }, [getCompletionCount, getTotalCount, isDayCompleted])

  // Handle date change
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate)
    // In a real app, this would trigger a page reload or data fetch
    window.location.href = `/habit_plans/my?duration_type=${habitPlan.duration_type}&date=${newDate}`
  }

  // Calculate real-time stats
  const calculateFocusMinutes = () => {
    // In a real app, this would come from actual time tracking data
    return Math.round(getCompletionCount() * 15) // 15 minutes per habit average
  }

  const calculateWeeklyAverage = () => {
    // Mock data for now - would come from real analytics
    return Math.round(85 + (Math.random() - 0.5) * 20)
  }

  const calculateTotalHabits = () => {
    return habitPlan.plan_sections.reduce((total, section) => total + section.plan_items.length, 0)
  }

  // Update stats in header when completion changes
  useEffect(() => {
    const focusMinutes = calculateFocusMinutes()
    const weeklyAvg = calculateWeeklyAverage()
    const totalHabits = calculateTotalHabits()
    const completionRate = getCompletionPercentage()

    // Update the header stats
    const weeklyAvgEl = document.getElementById('weekly-average')
    const focusMinutesEl = document.getElementById('focus-minutes')
    const weeklyPercentageEl = document.getElementById('weekly-percentage')
    const totalHabitsEl = document.getElementById('total-habits')
    const completionRateEl = document.getElementById('completion-rate')
    const dailyProgressEl = document.getElementById('daily-progress')

    if (weeklyAvgEl) weeklyAvgEl.textContent = `${weeklyAvg}%`
    if (focusMinutesEl) focusMinutesEl.textContent = focusMinutes
    if (weeklyPercentageEl) weeklyPercentageEl.textContent = `${weeklyAvg}%`
    if (totalHabitsEl) totalHabitsEl.textContent = totalHabits
    if (completionRateEl) completionRateEl.textContent = `${completionRate}%`
    if (dailyProgressEl) dailyProgressEl.textContent = `${completionRate}% done`
  }, [getCompletionCount, getCompletionPercentage])

  // Render Weekly Trends Chart
  useEffect(() => {
    const chartContainer = document.getElementById('weekly-trends-chart')
    if (chartContainer) {
      const root = createRoot(chartContainer)
      root.render(<WeeklyTrendsChart />)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  if (!habitPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
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
              <Target className="h-12 w-12 text-warning" />
            </motion.h2>
            <h3 className="text-xl font-semibold mb-2">No Habit Plan Found</h3>
            <p className="text-base-content/70 mb-4">Please create a habit plan to get started.</p>
            <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-base-200"
    >
      {/* Progress Overview */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Overall Progress */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 shadow-lg relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="card-body items-center text-center">
              <ProgressRing
                percentage={getCompletionPercentage()}
                size={80}
                color="#3B82F6"
                showPercentage={true}
              />
              <h3 className="text-lg font-semibold mt-4 text-base-content">Today's Progress</h3>
              <p className="text-sm text-base-content/70">
                {getCompletionCount()}/{getTotalCount()} completed
              </p>
            </div>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-xl border border-emerald-400/30 shadow-lg relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30l-10-10v20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="card-body items-center text-center">
              <StreakDisplay
                streak={habitPlan.current_streak || 0}
                label="Day Streak"
                showFire={true}
              />
            </div>
          </motion.div>

          {/* Completion Rate */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/30 shadow-lg relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Crect x='25' y='25' width='10' height='10' rx='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-base-content">Weekly Avg</h3>
              <p className="text-2xl font-bold text-primary">85%</p>
              <p className="text-sm text-base-content/70">Last 7 days</p>
            </div>
          </motion.div>

          {/* Time Focused */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl border border-amber-400/30 shadow-lg relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30 20v10l8 8' stroke='white' stroke-width='1' fill='none'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <h3 className="text-lg font-semibold text-base-content">Focus Time</h3>
              <p className="text-2xl font-bold text-secondary">42m</p>
              <p className="text-sm text-base-content/70">Today</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Biohacking Layout - 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Overview + Analytics */}
        <div className="space-y-6">
          {/* Daily Insights - Moved to top */}
          <DailyInsights />

          {/* AI Recommendations */}
          <AIRecommendations
            onAddRecommendation={(rec) => console.log('Adding recommendation:', rec)}
          />

          {/* Habit Schedule Builder */}
          <HabitScheduleBuilder
            habits={habitPlan.plan_sections.flatMap(section => 
              section.plan_items.map(item => ({
                id: item.id,
                name: item.content,
                category: section.name,
                icon: section.name.includes('Mind') ? '🧘‍♂️' : 
                      section.name.includes('Body') ? '💪' : '🎯',
                completed: new Array(7).fill(false) // Mock data
              }))
            )}
          />
        </div>

        {/* Right Column: Planner + Insights */}
        <div className="space-y-6">
          {/* Date Navigator for Daily Plans */}
          {habitPlan.duration_type === 'daily' && (
            <motion.div
              variants={itemVariants}
            >
              <DateNavigator
                currentDate={currentDate}
                onDateChange={handleDateChange}
                completedDates={[]} // Would be populated from habit plan data
              />
            </motion.div>
          )}

          {/* Habit Sections */}
          <motion.div
            variants={containerVariants}
            className="space-y-6"
          >
            {habitPlan.plan_sections.map((section, index) => (
              <HabitSection
                key={section.id}
                section={section}
                completions={completions}
                onToggleItem={toggleCompletion}
                index={index}
                disabled={isUpdating}
              />
            ))}
          </motion.div>

          {/* Biohacking Journal */}
          {habitPlan.duration_type === 'daily' && habitLog && (
            <motion.div
              variants={itemVariants}
            >
              <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">🧠</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Biohacking Journal</h3>
                      <p className="text-sm text-base-content/70">Track your optimization journey</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-base-content mb-2">
                      How did today's habits affect your clarity or energy?
                    </p>
                    <textarea
                      className="textarea textarea-bordered w-full h-24 resize-none"
                      placeholder="Share your biohacking insights..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-base-content/60">0 words</span>
                      <button className="btn btn-primary btn-sm">Save Reflection</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Completion Celebration */}
      <CompletionCelebration
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        streak={habitPlan.current_streak || 0}
        completionPercentage={getCompletionPercentage()}
      />
    </motion.div>
  )
}
