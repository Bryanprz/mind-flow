import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import HabitItem from './HabitItem'
import ProgressRing from './ProgressRing'

export default function HabitSection({ 
  section, 
  completions = {},
  onToggleItem,
  index = 0,
  disabled = false
}) {
  const completedCount = section.plan_items.filter(item => completions[item.id]).length
  const totalCount = section.plan_items.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isCompleted = completedCount === totalCount && totalCount > 0

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Glassmorphism card */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        bg-base-100/80 backdrop-blur-xl border border-base-300/50
        ${isCompleted ? 'ring-2 ring-green-400/50 shadow-lg shadow-green-500/20' : ''}
        transition-all duration-300 hover:shadow-xl hover:shadow-primary/10
      `}>
        
        {/* Gradient overlay for completed sections */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Section header */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${isCompleted 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-600'
                }
              `}
              animate={{ 
                scale: isCompleted ? [1, 1.05, 1] : 1,
                rotate: isCompleted ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <Sparkles className="w-6 h-6 text-white" />
              )}
            </motion.div>
            
            <div>
              <motion.h2
                className={`
                  text-xl font-bold transition-all duration-300
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent' 
                    : 'text-base-content'
                  }
                `}
                animate={{ 
                  scale: isCompleted ? [1, 1.02, 1] : 1 
                }}
                transition={{ duration: 0.4 }}
              >
                {section.name}
              </motion.h2>
              
              <motion.div
                className="flex items-center gap-2 text-sm text-base-content/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{completedCount}/{totalCount} completed</span>
              </motion.div>
            </div>
          </div>

          {/* Progress ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <ProgressRing
              percentage={completionPercentage}
              size={80}
              strokeWidth={6}
              color={isCompleted ? '#10B981' : '#3B82F6'}
              backgroundColor="#374151"
            />
          </motion.div>
        </div>

        {/* Habit items */}
        <div className="space-y-3">
          {section.plan_items.map((item, itemIndex) => (
            <HabitItem
              key={item.id}
              item={item}
              isCompleted={completions[item.id] || false}
              onToggle={onToggleItem}
              index={itemIndex}
              disabled={disabled}
            />
          ))}
        </div>

        {/* Completion celebration */}
        {isCompleted && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-2xl">🎉</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
