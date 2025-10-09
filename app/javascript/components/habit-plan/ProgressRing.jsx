import React from 'react'
import { motion } from 'framer-motion'

export default function ProgressRing({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  className = ''
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.2
          }}
          className="drop-shadow-sm"
        />
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.span
            className="text-lg font-bold text-base-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {percentage}%
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}
