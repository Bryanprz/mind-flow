import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, TrendingUp, Lightbulb, Target } from 'lucide-react'

export default function DailyInsights({ 
  className = ''
}) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentInsight, setCurrentInsight] = useState(0)

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
    }
  ]

  const insights = [
    {
      icon: "🧠",
      title: "Focus Patterns",
      description: "Meditation before work increases your focus by 23%. Keep this routine consistent.",
      color: "text-blue-400",
      bg: "bg-gray-900",
      border: "border-blue-400"
    },
    {
      icon: "⚡",
      title: "Energy Optimization",
      description: "Your hydration score correlates with afternoon energy. Maintain 8+ glasses for peak performance.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    },
    {
      icon: "🎯",
      title: "Habit Momentum",
      description: "You're 3 days away from a new 30-day streak record. Keep the momentum going!",
      color: "text-green-400",
      bg: "bg-gray-900",
      border: "border-green-400"
    }
  ]

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 10000)

    return () => clearInterval(quoteInterval)
  }, [quotes.length])

  // Rotate insights every 15 seconds
  useEffect(() => {
    const insightInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length)
    }, 15000)

    return () => clearInterval(insightInterval)
  }, [insights.length])

  const currentQuoteData = quotes[currentQuote]
  const currentInsightData = insights[currentInsight]

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Performance Insight */}
      <motion.div
        className={`card ${currentInsightData.bg} border ${currentInsightData.border} shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="card-body p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{currentInsightData.icon}</div>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInsight}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className={`text-lg font-bold ${currentInsightData.color} mb-2`}>
                    {currentInsightData.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    currentInsightData.title === "Habit Momentum" ? "text-green-400" 
                    : currentInsightData.title === "Focus Patterns" ? "text-blue-400"
                    : "text-base-content/80"
                  }`}>
                    {currentInsightData.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-1">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentInsight 
                      ? (currentInsightData.title === "Habit Momentum" ? 'bg-green-400' 
                         : currentInsightData.title === "Focus Patterns" ? 'bg-blue-400'
                         : 'bg-blue-500')
                      : (currentInsightData.title === "Habit Momentum" ? 'bg-green-400/30' 
                         : currentInsightData.title === "Focus Patterns" ? 'bg-blue-400/30'
                         : 'bg-blue-200')
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
