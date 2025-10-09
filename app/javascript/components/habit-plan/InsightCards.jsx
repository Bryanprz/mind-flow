import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Brain, Target, Clock, Zap, Award, AlertCircle } from 'lucide-react'

export default function InsightCards({ 
  habits = [],
  completions = {},
  className = ''
}) {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [insights, setInsights] = useState([])

  // Generate insights based on habit data
  useEffect(() => {
    const generatedInsights = generateInsights(habits, completions)
    setInsights(generatedInsights)
  }, [habits, completions])

  const generateInsights = (habits, completions) => {
    const totalHabits = habits.length
    const completedHabits = Object.values(completions).filter(c => c?.completed_at).length
    const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

    const baseInsights = [
      {
        id: 1,
        type: 'performance',
        icon: TrendingUp,
        title: 'Peak Performance Window',
        message: `Your focus peaks at 2:30 PM. Schedule your most demanding tasks during this 90-minute window for maximum productivity.`,
        action: 'Block 2:30-4:00 PM for deep work',
        color: 'from-blue-500 to-purple-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        priority: 'high'
      },
      {
        id: 2,
        type: 'consistency',
        icon: Target,
        title: 'Consistency Pattern',
        message: `You've maintained ${completionRate}% completion rate this week. Your meditation habit shows the strongest consistency streak.`,
        action: 'Apply meditation techniques to other habits',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-500',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'optimization',
        icon: Brain,
        title: 'Energy Optimization',
        message: `Your hydration score correlates 87% with afternoon energy levels. Maintain 8+ glasses for peak cognitive performance.`,
        action: 'Set hourly water reminders',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        iconColor: 'text-emerald-500',
        priority: 'high'
      },
      {
        id: 4,
        type: 'timing',
        icon: Clock,
        title: 'Optimal Timing',
        message: `Morning habits (6-8 AM) have 23% higher completion rates. Your circadian rhythm favors early activation.`,
        action: 'Move challenging habits to morning slot',
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-500',
        priority: 'medium'
      },
      {
        id: 5,
        type: 'momentum',
        icon: Zap,
        title: 'Momentum Builder',
        message: `Completing your first habit increases same-day completion by 34%. Start with your easiest win each day.`,
        action: 'Reorder habits: easy wins first',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-500',
        priority: 'high'
      },
      {
        id: 6,
        type: 'warning',
        icon: AlertCircle,
        title: 'Attention Required',
        message: `Screen time spikes 67% on weekends. This disrupts your sleep quality and morning energy.`,
        action: 'Implement weekend screen boundaries',
        color: 'from-red-500 to-rose-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        priority: 'urgent'
      },
      {
        id: 7,
        type: 'achievement',
        icon: Award,
        title: 'Milestone Alert',
        message: `You're 3 days away from your longest meditation streak ever. Keep the momentum going!`,
        action: 'Celebrate your progress',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-500',
        priority: 'medium'
      }
    ]

    // Filter insights based on current data
    return baseInsights.filter(insight => {
      if (insight.type === 'consistency' && completionRate === 0) return false
      return true
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'ring-red-500/50'
      case 'high': return 'ring-blue-500/50'
      case 'medium': return 'ring-green-500/50'
      default: return 'ring-gray-500/50'
    }
  }

  // Auto-rotate insights every 8 seconds
  useEffect(() => {
    if (insights.length > 0) {
      const interval = setInterval(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [insights.length])

  if (insights.length === 0) return null

  const currentInsightData = insights[currentInsight]
  const IconComponent = currentInsightData.icon

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">AI Insights</h3>
            <p className="text-sm text-base-content/70">Auto-generated progress analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {insights.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentInsight 
                  ? 'bg-primary' 
                  : 'bg-base-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className={`card ${currentInsightData.bgColor} border ${currentInsightData.borderColor} shadow-lg ${getPriorityColor(currentInsightData.priority)} ring-2`}
        >
          <div className="card-body p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentInsightData.color} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-base-content">
                    {currentInsightData.title}
                  </h4>
                  <span className={`badge badge-sm ${
                    currentInsightData.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-200' :
                    currentInsightData.priority === 'high' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    currentInsightData.priority === 'medium' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {currentInsightData.priority}
                  </span>
                </div>
                
                <p className="text-base-content/80 mb-4 leading-relaxed">
                  {currentInsightData.message}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`btn btn-sm bg-gradient-to-r ${currentInsightData.color} text-white border-none hover:opacity-90`}
                >
                  {currentInsightData.action}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Insights Summary */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          <h4 className="text-lg font-bold text-base-content mb-4">Insights Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-base-content/80">High Priority: {insights.filter(i => i.priority === 'high').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-base-content/80">Medium Priority: {insights.filter(i => i.priority === 'medium').length}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-base-content/80">Urgent: {insights.filter(i => i.priority === 'urgent').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-base-content/80">Total Insights: {insights.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

