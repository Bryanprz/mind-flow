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
      icon: "📈",
      title: "Performance Peak",
      description: "Your cognitive performance peaks at 2:30 PM. Schedule your most demanding tasks during this window.",
      color: "text-blue-500",
      bg: "bg-info",
      border: "border-info/30"
    },
    {
      icon: "🧠",
      title: "Focus Patterns",
      description: "Meditation before work increases your focus by 23%. Keep this routine consistent.",
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200"
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
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-200"
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
      {/* Daily Quote */}
      <motion.div
        className="card bg-base-100/90 backdrop-blur-xl border border-base-300/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-body p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Quote className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <blockquote className="text-lg font-medium text-base-content leading-relaxed mb-3">
                    "{currentQuoteData.text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <cite className="text-sm font-semibold text-base-content/80 not-italic">
                        — {currentQuoteData.author}
                      </cite>
                      <div className="badge badge-sm bg-blue-100 text-blue-700 border-blue-200 mt-1">
                        {currentQuoteData.category}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {quotes.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentQuote 
                              ? 'bg-blue-500' 
                              : 'bg-blue-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

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
                  <p className="text-base-content/80 leading-relaxed">
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
                      ? 'bg-blue-500' 
                      : 'bg-blue-200'
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
