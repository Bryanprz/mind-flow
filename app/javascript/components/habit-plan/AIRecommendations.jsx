import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, Plus, CheckCircle } from 'lucide-react'

export default function AIRecommendations({ 
  className = '',
  onAddRecommendation
}) {
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const recommendations = [
    {
      id: 1,
      text: "Based on your focus patterns, try adding a 5-minute breathing break before work.",
      type: "breathing",
      icon: "🧘‍♂️",
      category: "Mind"
    },
    {
      id: 2,
      text: "Your energy peaks at 2 PM. Schedule deep work during this window.",
      type: "timing",
      icon: "⚡",
      category: "Performance"
    },
    {
      id: 3,
      text: "Your meditation streak is strong. Consider adding a 2-minute gratitude practice.",
      type: "gratitude",
      icon: "🙏",
      category: "Mindfulness"
    },
    {
      id: 4,
      text: "Screen time spikes at 6 PM. Try a 15-minute nature walk instead.",
      type: "detox",
      icon: "🌿",
      category: "Recovery"
    },
    {
      id: 5,
      text: "Your hydration score dropped 20%. Set hourly water reminders.",
      type: "hydration",
      icon: "💧",
      category: "Health"
    }
  ]

  // Rotate recommendations every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendation((prev) => (prev + 1) % recommendations.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [recommendations.length])

  const handleAddRecommendation = (rec) => {
    if (onAddRecommendation) {
      onAddRecommendation(rec)
    }
    
    // Show success feedback
    const button = document.getElementById(`add-btn-${rec.id}`)
    if (button) {
      button.innerHTML = '<CheckCircle className="w-4 h-4" />'
      button.classList.add('text-green-500')
      setTimeout(() => {
        button.innerHTML = '<Plus className="w-4 h-4" />'
        button.classList.remove('text-green-500')
      }, 2000)
    }
  }

  const currentRec = recommendations[currentRecommendation]

  if (!isVisible) return null

  return (
    <motion.div
      className={`card bg-base-100 shadow-sm rounded-lg p-6 border border-base-300/50 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="card-body p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-base-content">AI Insights</h3>
              <p className="text-sm text-base-content/70">Personalized recommendations</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVisible(false)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            ×
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{currentRec.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-base-content leading-relaxed">
                  {currentRec.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-sm bg-blue-100 text-blue-700 border-blue-200">
                    {currentRec.category}
                  </span>
                  <div className="flex gap-1">
                    {recommendations.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentRecommendation 
                            ? 'bg-blue-500' 
                            : 'bg-blue-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                id={`add-btn-${currentRec.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddRecommendation(currentRec)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4" />
                Add to Plan
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentRecommendation((prev) => (prev + 1) % recommendations.length)}
                className="btn btn-ghost btn-sm"
              >
                <Sparkles className="w-4 h-4" />
                Next Tip
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
