import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Target, Flame, TrendingUp } from 'lucide-react'
import ProgressRing from './ProgressRing'
import HabitSparkline from './HabitSparkline'

// Helper function to clean ActionText content
const cleanActionTextContent = (content) => {
  if (!content) return ''
  
  // Remove ActionText HTML comments and wrapper divs
  return content
    .replace(/<!-- BEGIN app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- END app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- BEGIN \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<!-- END \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<div class="trix-content">/g, '')
    .replace(/<\/div>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const HabitCard = React.memo(function HabitCard({ habit, index, onToggleHabit, weekDays }) {
  const completedCount = habit.completed.filter(Boolean).length
  const completionRate = Math.round((completedCount / 7) * 100)
  const isToday = (dayIndex) => dayIndex === new Date().getDay() - 1 // Monday = 0

  // Generate mock 4-week data for sparkline
  const sparklineData = Array.from({ length: 28 }, (_, i) => ({
    day: i,
    completed: Math.random() > 0.3 ? 1 : 0 // 70% completion rate on average
  }))

  // Calculate weekly completion trend
  const weeklyTrend = Array.from({ length: 4 }, (_, weekIndex) => {
    const startDay = weekIndex * 7
    const weekData = sparklineData.slice(startDay, startDay + 7)
    return weekData.reduce((sum, day) => sum + day.completed, 0)
  })

  const getProgressColor = (rate) => {
    if (rate >= 75) return '#10b981' // emerald
    if (rate >= 50) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const getProgressGradient = (rate) => {
    if (rate >= 75) return 'from-emerald-400 to-green-500'
    if (rate >= 50) return 'from-yellow-400 to-amber-500'
    return 'from-red-400 to-pink-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card bg-gradient-to-br from-base-100/90 to-base-100/70 backdrop-blur-xl border border-base-300/30 shadow-xl hover:shadow-2xl transition-all duration-300"
      style={{
        // Modern overflow handling
        contain: 'layout style',
        maxWidth: '100%'
      }}
    >
      <div className="card-body p-6 overflow-hidden">
        {/* Header Section */}
        <div className="mb-4">
          {/* Title Row */}
          <div className="flex items-start gap-3 mb-3">
            <ProgressRing
              percentage={completionRate}
              size={40}
              color={getProgressColor(completionRate)}
              showPercentage={false}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-base-content leading-tight break-words" title={cleanActionTextContent(habit.name)}>
                {cleanActionTextContent(habit.name)}
              </div>
            </div>
          </div>
          
          {/* Category and Stats Row */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-base-content/60">{habit.category}</div>
            <div className="text-right">
              <div className="text-sm font-bold text-base-content">{completionRate}%</div>
              <div className="text-xs text-base-content/60">this week</div>
            </div>
          </div>
        </div>

        {/* Weekly Tracker Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-base-content/70">This Week</div>
            <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {weekDays.map((day, dayIndex) => {
                const isCompleted = habit.completed[dayIndex]
                const today = isToday(dayIndex)
                
                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleHabit(habit.id, dayIndex)}
                    className={`
                      relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                      ${isCompleted
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-300'
                        : today
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg shadow-blue-500/30 border border-blue-300 hover:from-blue-500 hover:to-purple-600'
                        : 'bg-gradient-to-br from-slate-600/50 to-slate-700/50 text-slate-300 hover:from-slate-500 hover:to-slate-600 border border-slate-500/30 hover:border-slate-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.6 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                        className="text-xs font-bold"
                      >
                        {today ? 'TODAY' : day.slice(0, 1)}
                      </motion.div>
                    )}
                    
                    {/* Streak indicator */}
                    {isCompleted && habit.streak > 1 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-yellow-900 font-bold">{habit.streak}</span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div className="relative h-2 bg-base-300/30 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getProgressGradient(completionRate)}`}
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-base-content/60 mt-1">
            <span>{completedCount}/7 days completed</span>
            <span>{completionRate}%</span>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sparkline Chart */}
          <div className="bg-base-200/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-base-content/70" />
              <span className="text-xs font-medium text-base-content/70">4-Week Trend</span>
            </div>
            <HabitSparkline data={weeklyTrend} />
          </div>

          {/* Streak Stats */}
          <div className="bg-base-200/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-base-content/70">Best Streak</span>
            </div>
            <div className="text-lg font-bold text-amber-500">{habit.streak} days</div>
            <div className="text-xs text-base-content/60">Current streak</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default HabitCard
