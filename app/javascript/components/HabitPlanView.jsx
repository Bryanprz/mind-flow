import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Target, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { useHabitCompletion } from '../hooks/useHabitCompletion'
import HabitSection from './habit-plan/HabitSection'
import ProgressRing from './habit-plan/ProgressRing'
import StreakDisplay from './habit-plan/StreakDisplay'
import DateNavigator from './habit-plan/DateNavigator'
import JournalEditor from './habit-plan/JournalEditor'
import CompletionCelebration from './habit-plan/CompletionCelebration'
import WeeklyHeatmap from './habit-plan/WeeklyHeatmap'

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
            className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
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
            className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
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
            className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
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
            className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
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

      {/* Weekly Heatmap */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
      >
        <WeeklyHeatmap
          weeklyData={[]} // Would be populated from real data
        />
      </motion.div>

      {/* Date Navigator for Daily Plans */}
      {habitPlan.duration_type === 'daily' && (
        <motion.div
          variants={itemVariants}
          className="mb-8"
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
        className="space-y-8"
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

      {/* Journal Editor for Daily Plans */}
      {habitPlan.duration_type === 'daily' && habitLog && (
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <JournalEditor
            habitLogId={habitLog.id}
            initialEntry={habitLog.journal_entry || ''}
            initialMood={habitLog.mood}
          />
        </motion.div>
      )}

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
