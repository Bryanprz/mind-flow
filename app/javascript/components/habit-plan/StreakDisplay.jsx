import React from 'react'
import { motion } from 'framer-motion'

export default function StreakDisplay({ 
  streak = 0, 
  label = "Day Streak",
  showFire = true,
  color = '#F59E0B',
  className = ''
}) {
  const fireVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: { 
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }

  const numberVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Fire emoji with animation */}
      {showFire && (
        <motion.div
          variants={fireVariants}
          initial="initial"
          animate="animate"
          className="text-4xl"
        >
          🔥
        </motion.div>
      )}
      
      {/* Streak number */}
      <motion.div
        className="text-center"
        variants={numberVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
          key={streak} // Re-trigger animation when streak changes
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {streak}
        </motion.span>
      </motion.div>
      
      {/* Label */}
      <motion.span
        className="text-sm font-medium text-base-content/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}
