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
  
  // Initialize completions from habit log (for authenticated users) or empty for demo
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
  
  // Limit plan items to 3 per section for both authenticated and unauthenticated users
  // Filter out unwanted sections: Dietary Guidelines, Herbal Remedies, Lifestyle Practices, Quick Wins, Mind-Body Connection
  const filteredPlanSections = habitPlan?.plan_sections?.filter(section => {
    const unwantedSections = ['Dietary Guidelines', 'Herbal Remedies', 'Lifestyle Practices', 'Quick Wins', 'Mind-Body Connection']
    return !unwantedSections.includes(section.name)
  }) || []
  
  const limitedPlanSections = filteredPlanSections.map(section => ({
    ...section,
    plan_items: section.plan_items.slice(0, 3)
  }))
  
  // Demo data for unauthenticated users
  const demoPlanSections = [
    {
      id: 'demo-1', 
      name: 'Daily Wellness',
      plan_items: [
        { id: 'demo-1-1', content: 'Morning meditation or mindfulness practice' },
        { id: 'demo-1-2', content: 'Gentle yoga or stretching routine' },
        { id: 'demo-1-3', content: 'Deep breathing exercises' }
      ]
    }
  ]
  
  // Use demo data for unauthenticated users, limited data for authenticated users
  const displayPlanSections = habitPlan ? limitedPlanSections : demoPlanSections
  
  // Daily motivational quotes carousel
  const quotes = [
    {
      text: "Discipline is freedom.",
      author: "Jocko Willink",
      category: "Mindset"
    },
    {
      text: "You can't improve what you don't measure.",
      author: "Peter Drucker",
      category: "Productivity"
    },
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha",
      category: "Mindfulness"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      category: "Consistency"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action"
    },
    {
      text: "Your cognitive performance peaks at 2:30 PM. Schedule your most demanding tasks during this window.",
      author: "Performance Peak",
      category: "Optimization"
    }
  ]
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  
  // Rotate quotes every 8 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 8000)

    return () => clearInterval(quoteInterval)
  }, [quotes.length])

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
      {/* Combined Date Navigation & Progress Overview */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
      >
        <div className="card bg-base-100/90 backdrop-blur-xl border border-base-300/30 shadow-lg">
          <div className="card-body p-6">
          {/* Top Row: Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="btn btn-circle btn-sm btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="text-center">
                <div className="text-lg font-semibold">Wednesday, October 8, 2025</div>
                <div className="flex items-center gap-2 justify-center mt-1">
                  <div className="text-sm text-base-content/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Today
                  </div>
                </div>
              </div>
              
              <button className="btn btn-circle btn-sm btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Small Quote Carousel - Right Aligned */}
            <div className="text-right max-w-xs">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuoteIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100 italic">
                      "{quotes[currentQuoteIndex].text}"
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      — {quotes[currentQuoteIndex].author}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Quote indicators */}
                <div className="flex gap-1 justify-end mt-2">
                  {quotes.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentQuoteIndex 
                          ? 'bg-primary' 
                          : 'bg-base-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Bottom Row: 4 Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" id="focus-minutes">0</div>
                <div className="text-sm text-base-content/70">Focus Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500" id="weekly-percentage">83%</div>
                <div className="text-sm text-base-content/70">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500" id="total-habits">36</div>
                <div className="text-sm text-base-content/70">Total Habits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500" id="completion-rate">0%</div>
                <div className="text-sm text-base-content/70">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Insight */}
      <motion.div variants={itemVariants} className="mb-8">
        <DailyInsights />
      </motion.div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
        {/* Left Column: Plan Sections */}
        <motion.div variants={containerVariants} className="flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-base-content">Today's Plan</h3>
              <p className="text-sm text-base-content/70">Complete your daily habits</p>
            </div>
          </div>
          
          {displayPlanSections.map((section, index) => (
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

        {/* Right Column: Habit Schedule Builder */}
        <motion.div variants={itemVariants}>
          <HabitScheduleBuilder
            planSections={displayPlanSections}
            completions={completions}
            onToggleItem={toggleCompletion}
          />
        </motion.div>
      </div>

      {/* AI Recommendations - Full Width */}
      <motion.div variants={itemVariants} className="mb-8">
        <AIRecommendations
          onAddRecommendation={(rec) => console.log('Adding recommendation:', rec)}
        />
      </motion.div>

      {/* Biohacking Journal - Full Width */}
      {habitPlan.duration_type === 'daily' && habitLog && (
        <motion.div variants={itemVariants}>
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
