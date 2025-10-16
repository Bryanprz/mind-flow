import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GaugeChart from 'react-gauge-chart'
import { Brain, Target, Zap, RefreshCw } from 'lucide-react'

export default function WellnessGauge({ currentUser }) {
  const [focusScore, setFocusScore] = useState(0.82) // 82% - Focus/Mental Clarity score
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredMetric, setHoveredMetric] = useState(null)
  const [clickCount, setClickCount] = useState(0)
  
  // CSS class constants for better organization
  const baseMetricCardClasses = "text-center p-2 bg-gray-700 rounded-md cursor-pointer transition-all"
  const metricCardVariants = {
    concentration: {
      hover: "rgba(59, 130, 246, 0.1)",
      active: "bg-blue-900 border border-blue-500"
    },
    clarity: {
      hover: "rgba(139, 92, 246, 0.1)",
      active: "bg-purple-900 border border-purple-500"
    },
    energy: {
      hover: "rgba(16, 185, 129, 0.1)",
      active: "bg-green-900 border border-green-500"
    }
  }
  
  // Simulate very subtle real-time updates - much more stable
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.01 // Very small ±1% variation
      setFocusScore(prev => {
        const newScore = Math.max(0.78, Math.min(0.85, prev + variation)) // Keep within very tight bounds
        return Math.round(newScore * 1000) / 1000 // Round to 3 decimal places for ultra-smooth animation
      })
    }, 15000) // Much longer interval - 15 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // Handle gauge click to boost score - simplified and stable
  const handleGaugeClick = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setClickCount(prev => prev + 1)
    
    // Simple, controlled boost
    setFocusScore(0.90) // Set to 90% immediately
    
    // Return to baseline after delay
    setTimeout(() => {
      setFocusScore(0.82) // Return to 82%
      setIsAnimating(false)
    }, 2000)
  }
  
  // Handle metric hover for detailed info
  const handleMetricHover = (metric) => {
    setHoveredMetric(metric)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gray-800 shadow-sm rounded-lg p-4 h-full flex flex-col border border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-200">Focus Score</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Clicks: {clickCount}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleGaugeClick}
            disabled={isAnimating}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            title="Click to boost focus!"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isAnimating ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      {/* Gauge Section */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center mb-4 cursor-pointer"
        onClick={handleGaugeClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Click gauge to boost focus!"
      >
        <GaugeChart
          id="focus-gauge"
          nrOfLevels={20}
          colors={["#EF4444", "#F59E0B", "#3B82F6"]}
          arcWidth={0.3}
          percent={focusScore}
          textColor="#ffffff"
          needleColor={isAnimating ? "#fbbf24" : "#3B82F6"}
          needleBaseColor={isAnimating ? "#fbbf24" : "#3B82F6"}
          formatTextValue={(value) => `${Math.round(value)}%`}
          animate={true}
          animDelay={100}
          animateDuration={2000}
          style={{ 
            width: '100%', 
            maxWidth: '280px', 
            height: '140px',
            filter: isAnimating ? 'drop-shadow(0 0 10px #fbbf24)' : 'none',
            transition: 'all 0.5s ease-in-out'
          }}
        />
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute text-xs text-yellow-600 font-bold"
          >
            +10% Boost!
          </motion.div>
        )}
      </motion.div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.concentration.hover }}
          onHoverStart={() => handleMetricHover('concentration')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`${baseMetricCardClasses} ${
            hoveredMetric === 'concentration' ? metricCardVariants.concentration.active : ''
          }`}
          title="Click to see concentration tips"
        >
          <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-200 leading-tight">Concentration</div>
          <div className="text-xs text-gray-400">
            {hoveredMetric === 'concentration' ? 'Tap to improve' : 'Excellent'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.clarity.hover }}
          onHoverStart={() => handleMetricHover('clarity')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`${baseMetricCardClasses} ${
            hoveredMetric === 'clarity' ? metricCardVariants.clarity.active : ''
          }`}
          title="Click to see clarity exercises"
        >
          <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-200 leading-tight">Clarity</div>
          <div className="text-xs text-gray-400">
            {hoveredMetric === 'clarity' ? 'Meditate more' : 'High'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.energy.hover }}
          onHoverStart={() => handleMetricHover('energy')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`${baseMetricCardClasses} ${
            hoveredMetric === 'energy' ? metricCardVariants.energy.active : ''
          }`}
          title="Click to see energy boosters"
        >
          <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-200 leading-tight">Mental Energy</div>
          <div className="text-xs text-gray-400">
            {hoveredMetric === 'energy' ? 'Take a break' : 'Strong'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

