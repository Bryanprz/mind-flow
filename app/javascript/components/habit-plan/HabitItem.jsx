import React from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Target } from 'lucide-react'

export default function HabitItem({ 
  item, 
  isCompleted, 
  onToggle, 
  index = 0,
  disabled = false 
}) {
  const handleToggle = () => {
    if (!disabled) {
      onToggle(item.id, !isCompleted)
    }
  }

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
          
          {/* Additional info could be added here in the future */}
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
