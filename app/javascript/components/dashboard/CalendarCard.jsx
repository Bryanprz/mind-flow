import React from 'react'
import { motion } from 'framer-motion'
import { Brain, BookOpen, Droplets, CheckCircle } from 'lucide-react'

export default function CalendarCard({ habitPlan, sectionPresenters }) {
  const habits = [
    {
      id: 'meditation',
      name: 'Meditation',
      icon: Brain,
      completed: true,
      streak: 12,
      duration: '10 min',
      color: 'blue'
    },
    {
      id: 'journaling',
      name: 'Journaling',
      icon: BookOpen,
      completed: true,
      streak: 8,
      duration: '5 min',
      color: 'purple'
    },
    {
      id: 'hydration',
      name: 'Hydration',
      icon: Droplets,
      completed: false,
      streak: 5,
      target: '8 glasses',
      color: 'green'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      green: 'text-green-600 bg-green-100'
    }
    return colors[color] || colors.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-sm rounded-lg p-6 h-full"
    >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-base-content">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Daily Habits
        </h2>

        <div className="space-y-4">
          {habits.map((habit, index) => {
            const Icon = habit.icon
            const colorClasses = getColorClasses(habit.color)
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  habit.completed ? 'bg-base-200 border-base-300' : 'bg-base-200 border-base-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-base-content">{habit.name}</div>
                    <div className="text-xs text-base-content/70">
                      {habit.duration && `${habit.duration} • `}
                      {habit.streak} day streak
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {habit.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-base-300"></div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress summary */}
        <div className="mt-6 pt-4 border-t border-base-300">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-base-content">Today's Progress:</span>
              <span className="ml-2 text-green-600">2/3 completed</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-base-content">Best Streak:</span>
              <span className="ml-2 text-blue-600">12 days</span>
            </div>
          </div>
        </div>
    </motion.div>
  )
}

