import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp } from 'lucide-react'

export default function WeeklyHeatmap({ 
  weeklyData = [],
  className = ''
}) {
  // Generate last 7 days of data
  const generateWeekData = () => {
    const days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayData = weeklyData.find(d => 
        new Date(d.date).toDateString() === date.toDateString()
      )
      
      days.push({
        date,
        completed: dayData?.completed || 0,
        total: dayData?.total || 0,
        percentage: dayData ? Math.round((dayData.completed / dayData.total) * 100) : 0
      })
    }
    
    return days
  }

  const weekData = generateWeekData()
  const weekTotal = weekData.reduce((sum, day) => sum + day.completed, 0)
  const weekPercentage = weekData.length > 0 ? 
    Math.round((weekTotal / weekData.reduce((sum, day) => sum + day.total, 0)) * 100) : 0

  const getIntensity = (percentage) => {
    if (percentage === 0) return 'bg-base-300'
    if (percentage < 25) return 'bg-red-200'
    if (percentage < 50) return 'bg-orange-300'
    if (percentage < 75) return 'bg-yellow-400'
    if (percentage < 100) return 'bg-green-400'
    return 'bg-green-600'
  }

  const getTextColor = (percentage) => {
    return percentage > 50 ? 'text-white' : 'text-base-content'
  }

  return (
    <motion.div
      className={`card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Weekly Progress</h3>
            <p className="text-sm text-base-content/70">Last 7 days activity</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekData.map((day, index) => (
            <motion.div
              key={day.date.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="text-xs text-base-content/70 mb-1">
                {day.date.toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <motion.div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${getIntensity(day.percentage)} ${getTextColor(day.percentage)}
                `}
                whileHover={{ scale: 1.1 }}
                title={`${day.date.toLocaleDateString()}: ${day.completed}/${day.total} habits (${day.percentage}%)`}
              >
                {day.completed}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-base-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-base-content">
              {weekTotal} habits completed this week
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-500">{weekPercentage}%</div>
            <div className="text-xs text-base-content/70">Weekly average</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <span className="text-base-content/70">Less</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((intensity) => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded ${getIntensity(intensity)}`}
              />
            ))}
          </div>
          <span className="text-base-content/70">More</span>
        </div>
      </div>
    </motion.div>
  )
}
