import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Zap, Clock } from 'lucide-react'

export default function StatsOverview({ habitPlan, currentUser }) {
  const stats = [
    {
      icon: Brain,
      label: 'Focus Streak',
      value: habitPlan.focusStreak || 7,
      suffix: 'days',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Heart,
      label: 'Mood Score',
      value: '8.2',
      suffix: '/10',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Zap,
      label: 'Energy Trend',
      value: '↗',
      suffix: 'rising',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      label: 'Mindfulness',
      value: '42',
      suffix: 'minutes',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="card bg-base-100 shadow-sm rounded-lg p-4"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-base-content">{stat.value}</div>
            <div className="text-xs text-base-content/70">{stat.suffix}</div>
            <div className="text-sm font-medium text-base-content/80 mt-1">{stat.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

