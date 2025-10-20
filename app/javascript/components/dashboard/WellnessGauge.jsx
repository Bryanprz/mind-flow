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
  const baseMetricCardClasses = "text-center p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-all"
  const metricCardVariants = {
    concentration: {
      hover: "rgba(34, 211, 238, 0.1)",
      active: "bg-cyan-500/10"
    },
    clarity: {
      hover: "rgba(139, 92, 246, 0.1)",
      active: "bg-purple-500/10"
    },
    energy: {
      hover: "rgba(245, 158, 11, 0.1)",
      active: "bg-amber-500/10"
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
      className="card theme-glass-card p-6 h-full flex flex-col hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold text-cyan-300 tracking-wide">FOCUS GAUGE</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs theme-text-accent">Boosts: {clickCount}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleGaugeClick}
            disabled={isAnimating}
            className="p-2 rounded-lg theme-glass-card-sm hover:theme-neon-glow transition-colors"
            title="Click to boost focus!"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isAnimating ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      {/* Gauge Section */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center mb-3 cursor-pointer overflow-hidden"
        onClick={handleGaugeClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Click gauge to boost focus!"
      >
        <GaugeChart
          id="focus-gauge"
          nrOfLevels={20}
          colors={["#EF4444", "#F59E0B", "#22d3ee"]}
          arcWidth={0.3}
          percent={focusScore}
          textColor="#ffffff"
          needleColor={isAnimating ? "#fbbf24" : "#22d3ee"}
          needleBaseColor={isAnimating ? "#fbbf24" : "#22d3ee"}
          formatTextValue={(value) => `${Math.round(value)}%`}
          animate={true}
          animDelay={100}
          animateDuration={2000}
          style={{ 
            width: '100%', 
            maxWidth: '200px', 
            height: '100px',
            filter: isAnimating ? 'drop-shadow(0 0 15px #22d3ee)' : 'drop-shadow(0 0 5px #22d3ee)',
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
      <div className="grid grid-cols-3 gap-1">
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.concentration.hover }}
          onHoverStart={() => handleMetricHover('concentration')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`text-center p-3 theme-glass-card-sm rounded-lg cursor-pointer transition-all ${
            hoveredMetric === 'concentration' ? metricCardVariants.concentration.active : ''
          }`}
          title="Click to see concentration tips"
        >
          <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-blue-300 leading-tight">Concentration</div>
          <div className="text-xs text-emerald-400">
            {hoveredMetric === 'concentration' ? 'Tap to improve' : 'Excellent'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.clarity.hover }}
          onHoverStart={() => handleMetricHover('clarity')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`text-center p-3 theme-glass-card-sm rounded-lg cursor-pointer transition-all ${
            hoveredMetric === 'clarity' ? metricCardVariants.clarity.active : ''
          }`}
          title="Click to see clarity exercises"
        >
          <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-purple-300 leading-tight">Clarity</div>
          <div className="text-xs text-emerald-400">
            {hoveredMetric === 'clarity' ? 'Meditate more' : 'High'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: metricCardVariants.energy.hover }}
          onHoverStart={() => handleMetricHover('energy')}
          onHoverEnd={() => handleMetricHover(null)}
          className={`text-center p-3 theme-glass-card-sm rounded-lg cursor-pointer transition-all ${
            hoveredMetric === 'energy' ? metricCardVariants.energy.active : ''
          }`}
          title="Click to see energy boosters"
        >
          <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-green-300 leading-tight">Mental Energy</div>
          <div className="text-xs text-emerald-400">
            {hoveredMetric === 'energy' ? 'Take a break' : 'Strong'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

