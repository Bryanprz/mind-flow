import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Target, Timer, Zap, Star, MessageSquare } from 'lucide-react'

export default function HabitItem({ 
  item, 
  isCompleted, 
  onToggle, 
  index = 0,
  disabled = false 
}) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')

  const handleToggle = () => {
    if (!disabled) {
      onToggle(item.id, !isCompleted)
    }
  }

  // Generate impact score and time estimate based on content
  const getImpactScore = () => {
    const content = item.content.toLowerCase()
    if (content.includes('meditation') || content.includes('focus') || content.includes('deep work')) return 3
    if (content.includes('exercise') || content.includes('journal') || content.includes('reading')) return 2
    return 1
  }

  const getTimeEstimate = () => {
    const content = item.content.toLowerCase()
    if (content.includes('minute') || content.includes('min')) {
      const match = content.match(/(\d+)\s*min/)
      return match ? `${match[1]}m` : '5m'
    }
    if (content.includes('hour')) return '1h'
    return '10m' // default
  }

  const getBestTime = () => {
    const content = item.content.toLowerCase()
    if (content.includes('morning') || content.includes('meditation')) return 'Best: 6-8 AM'
    if (content.includes('evening') || content.includes('journal')) return 'Best: 8-10 PM'
    if (content.includes('work') || content.includes('focus')) return 'Best: 9-11 AM'
    return 'Best: Anytime'
  }

  const impactScore = getImpactScore()
  const timeEstimate = getTimeEstimate()
  const bestTime = getBestTime()

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
      className={`
        relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300
        ${isCompleted 
          ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30' 
          : 'bg-base-200/80 backdrop-blur-sm border border-base-300 hover:border-primary/50'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'}
      `}
      onClick={handleToggle}
      onKeyDown={handleKeyPress}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={isCompleted}
      aria-disabled={disabled}
      aria-label={`${item.content} - ${isCompleted ? 'Completed' : 'Not completed'}`}
    >
      {/* Background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isCompleted ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-center gap-4">
        {/* Checkbox */}
        <motion.div
          className={`
            relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
            ${isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-base-300 hover:border-primary'
            }
          `}
          animate={{ 
            scale: isCompleted ? [1, 1.1, 1] : 1,
            rotate: isCompleted ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                className={`
                  font-medium transition-all duration-300
                  ${isCompleted 
                    ? 'line-through text-base-content/60' 
                    : 'text-base-content'
                  }
                `}
                animate={{ 
                  opacity: isCompleted ? 0.7 : 1 
                }}
              >
                {item.content}
              </motion.div>
              
              {/* Smart Info Row */}
              <div className="flex items-center gap-3 mt-2">
                {/* Impact Score */}
                <div className="flex items-center gap-1">
                  {[...Array(impactScore)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Zap className="w-3 h-3 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Time Estimate */}
                <div className="flex items-center gap-1 text-xs text-base-content/60">
                  <Clock className="w-3 h-3" />
                  <span>{timeEstimate}</span>
                </div>
                
                {/* Best Time Suggestion */}
                <div className="text-xs text-blue-500/80 font-medium">
                  {bestTime}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {/* Timer Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-ghost btn-sm btn-circle"
                title="Start Timer"
              >
                <Timer className="w-4 h-4" />
              </motion.button>
              
              {/* Notes Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotes(!showNotes)}
                className="btn btn-ghost btn-sm btn-circle"
                title="Add Notes"
              >
                <MessageSquare className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Notes Section */}
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-base-300"
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this habit..."
                  className="textarea textarea-bordered textarea-sm w-full"
                  rows={2}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isCompleted ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-green-500"
        >
          <Target className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Completion animation overlay */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      )}
    </motion.div>
  )
}
