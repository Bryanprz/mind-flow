import React from 'react'
import { motion } from 'framer-motion'

const HabitSparkline = React.memo(function HabitSparkline({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-8 flex items-center justify-center">
        <div className="text-xs text-base-content/40">No data</div>
      </div>
    )
  }

  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  // Create SVG path
  const width = 80
  const height = 32
  const padding = 4

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const pathData = `M ${points.split(' ')[0]} L ${points.slice(points.indexOf(' ') + 1)}`

  // Create area fill path
  const areaPath = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`

  return (
    <div className="h-8 w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#sparklineGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
        />
        
        {/* Data points */}
        {points.split(' ').map((point, index) => {
          const [x, y] = point.split(',').map(Number)
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            />
          )
        })}
      </svg>
    </div>
  )
})

export default HabitSparkline
