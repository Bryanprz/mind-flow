import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Flame, Target, TrendingUp } from 'lucide-react'

export default function StreakCalendar({ 
  habits = [],
  completions = {},
  className = ''
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [viewMode, setViewMode] = useState('month') // 'month' or 'year'

  // Generate calendar data
  const generateCalendarData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const calendar = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null)
    }

    // Add days of month with completion data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      
      // Calculate completion intensity (0-4)
      const completionData = getCompletionData(dateStr)
      const intensity = completionData.completionRate / 20 // Convert to 0-4 scale
      
      calendar.push({
        day,
        date: dateStr,
        intensity: Math.round(intensity),
        completionRate: completionData.completionRate,
        completedHabits: completionData.completedHabits,
        totalHabits: completionData.totalHabits,
        isToday: date.toDateString() === new Date().toDateString(),
        isFuture: date > new Date()
      })
    }

    return calendar
  }

  const getCompletionData = (dateStr) => {
    // Mock data - in real app, would come from actual completion logs
    const totalHabits = habits.length || 5
    const completedHabits = Math.floor(Math.random() * (totalHabits + 1))
    const completionRate = Math.round((completedHabits / totalHabits) * 100)
    
    return {
      completedHabits,
      totalHabits,
      completionRate
    }
  }

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-base-300'
    if (intensity === 1) return 'bg-green-200'
    if (intensity === 2) return 'bg-green-400'
    if (intensity === 3) return 'bg-green-600'
    if (intensity === 4) return 'bg-green-700'
    return 'bg-base-300'
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const calendarData = generateCalendarData()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Calculate streaks
  const calculateStreaks = () => {
    const today = new Date()
    const streaks = []
    
    // Current streak
    let currentStreak = 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const data = getCompletionData(dateStr)
      
      if (data.completionRate >= 80) {
        currentStreak++
      } else {
        break
      }
    }

    // Longest streak this month
    let longestStreak = 0
    let tempStreak = 0
    for (let day = 1; day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateStr = date.toISOString().split('T')[0]
      const data = getCompletionData(dateStr)
      
      if (data.completionRate >= 80) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return { currentStreak, longestStreak }
  }

  const streaks = calculateStreaks()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Streak Calendar</h3>
            <p className="text-sm text-base-content/70">Visual habit completion heatmap</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['month', 'year'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-ghost'}`}
              >
                {mode === 'month' ? 'Month' : 'Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-lg font-bold text-base-content">{streaks.currentStreak}</div>
            <div className="text-sm text-base-content/70">Current Streak</div>
          </div>
        </div>

        <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-lg font-bold text-base-content">{streaks.longestStreak}</div>
            <div className="text-sm text-base-content/70">Longest This Month</div>
          </div>
        </div>

        <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
          <div className="card-body p-4 text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-lg font-bold text-base-content">87%</div>
            <div className="text-sm text-base-content/70">Monthly Average</div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth(-1)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <h4 className="text-lg font-bold text-base-content">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth(1)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-base-content/70 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`
                        w-full h-full rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all
                        ${day.isToday ? 'ring-2 ring-primary' : ''}
                        ${day.isFuture ? 'text-base-content/30' : 'text-base-content'}
                        ${getIntensityColor(day.intensity)}
                      `}
                      title={`${day.date}: ${day.completionRate}% complete (${day.completedHabits}/${day.totalHabits} habits)`}
                    >
                      {day.day}
                    </motion.div>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-base-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/70">Less</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-4 h-4 rounded ${getIntensityColor(intensity)}`}
                    title={`${intensity === 0 ? '0%' : `${intensity * 25}%`} completion`}
                  />
                ))}
              </div>
              <span className="text-sm text-base-content/70">More</span>
            </div>
            <div className="text-center text-xs text-base-content/60 mt-2">
              Completion intensity
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

