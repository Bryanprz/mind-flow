import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export default function HabitChart({ habitPlan }) {
  const [data, setData] = useState([
    { name: 'Mon', focus: 6.8, mood: 7.2, energy: 7.5, meditation: 15, deepWork: 3.5, flow: 1.2 },
    { name: 'Tue', focus: 8.1, mood: 7.8, energy: 8.2, meditation: 25, deepWork: 4.2, flow: 2.1 },
    { name: 'Wed', focus: 8.5, mood: 8.0, energy: 7.8, meditation: 20, deepWork: 5.1, flow: 2.8 },
    { name: 'Thu', focus: 7.2, mood: 6.9, energy: 6.5, meditation: 10, deepWork: 2.8, flow: 0.8 },
    { name: 'Fri', focus: 8.9, mood: 8.4, energy: 9.1, meditation: 30, deepWork: 6.2, flow: 3.5 },
    { name: 'Sat', focus: 7.8, mood: 8.1, energy: 7.2, meditation: 45, deepWork: 2.1, flow: 1.8 },
    { name: 'Sun', focus: 8.2, mood: 8.2, energy: 8.8, meditation: 35, deepWork: 3.8, flow: 2.4 },
  ])
  
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [hoveredDay, setHoveredDay] = useState(null)
  const [isLiveMode, setIsLiveMode] = useState(true)
  
  // Simulate live data updates with more realistic patterns
  useEffect(() => {
    if (!isLiveMode) return
    
    const interval = setInterval(() => {
      setData(prevData => prevData.map((day, index) => {
        // Create realistic daily patterns
        const isWeekend = index >= 5 // Sat, Sun
        const isPeakDay = index === 4 // Friday
        const isLowDay = index === 3 // Thursday
        
        const baseVariation = 0.15 // Smaller, more realistic variations
        
        return {
          ...day,
          focus: Math.max(4, Math.min(10, day.focus + (Math.random() - 0.5) * baseVariation)),
          mood: Math.max(5, Math.min(10, day.mood + (Math.random() - 0.5) * baseVariation)),
          energy: Math.max(4, Math.min(10, day.energy + (Math.random() - 0.5) * baseVariation)),
          meditation: Math.max(0, Math.min(60, day.meditation + (Math.random() - 0.5) * 5)),
          deepWork: Math.max(0, Math.min(8, day.deepWork + (Math.random() - 0.5) * 0.5)),
          flow: Math.max(0, Math.min(6, day.flow + (Math.random() - 0.5) * 0.3)),
        }
      }))
    }, 5000) // Slower updates for more realistic feel
    
    return () => clearInterval(interval)
  }, [isLiveMode])
  
  // Handle metric selection
  const handleMetricClick = (metric) => {
    setSelectedMetric(selectedMetric === metric ? null : metric)
  }
  
  // Calculate trends
  const getTrend = (metric) => {
    const today = data[data.length - 1][metric]
    const yesterday = data[data.length - 2][metric]
    return today > yesterday ? 'up' : 'down'
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
          <h2 className="text-lg font-semibold text-gray-200">Cognitive Metrics</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiveMode(!isLiveMode)}
          className={`p-1 rounded-full transition-colors ${
            isLiveMode ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}
          title={isLiveMode ? 'Live mode ON - Click to pause' : 'Live mode OFF - Click to resume'}
        >
          <BarChart3 className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Chart Section */}
      <div className="flex-1 mb-3">
        <ResponsiveContainer 
          width="100%" 
          height={200}
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'optimizeLegibility'
          }}
        >
          <LineChart 
            data={data}
            style={{
              shapeRendering: 'geometricPrecision',
              textRendering: 'optimizeLegibility'
            }}
          >
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              shapeRendering="geometricPrecision"
            />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <YAxis 
              domain={[0, 10]}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'white'
              }}
              formatter={(value, name) => {
                const unit = name === 'meditation' ? ' min' : name === 'deepWork' ? ' hrs' : name === 'flow' ? ' hrs' : '/10'
                return [`${value.toFixed(1)}${unit}`, name]
              }}
              labelFormatter={(label) => `${label} - Cognitive Performance`}
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#3b82f6" 
              strokeWidth={selectedMetric === 'focus' || !selectedMetric ? 3 : 2}
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 2, 
                r: selectedMetric === 'focus' || !selectedMetric ? 4 : 3,
                onClick: () => setSelectedMetric('focus')
              }}
              name="Focus"
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8b5cf6" 
              strokeWidth={selectedMetric === 'mood' || !selectedMetric ? 3 : 2}
              dot={{ 
                fill: '#8b5cf6', 
                strokeWidth: 2, 
                r: selectedMetric === 'mood' || !selectedMetric ? 4 : 3,
                onClick: () => setSelectedMetric('mood')
              }}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#10b981" 
              strokeWidth={selectedMetric === 'energy' || !selectedMetric ? 3 : 2}
              dot={{ 
                fill: '#10b981', 
                strokeWidth: 2, 
                r: selectedMetric === 'energy' || !selectedMetric ? 4 : 3,
                onClick: () => setSelectedMetric('energy')
              }}
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Interactive Legend */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <motion.div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleMetricClick('focus')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-2 h-2 rounded-full transition-all ${
            selectedMetric === 'focus' ? 'bg-blue-600 scale-125' : 'bg-blue-500'
          }`}></div>
          <span className={`text-xs transition-colors ${
            selectedMetric === 'focus' ? 'text-blue-600 font-semibold' : 'text-base-content/70'
          }`}>Focus</span>
          {getTrend('focus') === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleMetricClick('mood')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-2 h-2 rounded-full transition-all ${
            selectedMetric === 'mood' ? 'bg-purple-600 scale-125' : 'bg-purple-500'
          }`}></div>
          <span className={`text-xs transition-colors ${
            selectedMetric === 'mood' ? 'text-purple-600 font-semibold' : 'text-base-content/70'
          }`}>Mood</span>
          {getTrend('mood') === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleMetricClick('energy')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-2 h-2 rounded-full transition-all ${
            selectedMetric === 'energy' ? 'bg-green-600 scale-125' : 'bg-green-500'
          }`}></div>
          <span className={`text-xs transition-colors ${
            selectedMetric === 'energy' ? 'text-green-600 font-semibold' : 'text-base-content/70'
          }`}>Energy</span>
          {getTrend('energy') === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
        </motion.div>
      </div>
      
      {/* Summary Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-base-300">
        <div className="text-xs">
          <span className="font-medium text-base-content">Avg Focus:</span>
          <span className="ml-1 text-blue-600 font-semibold">
            {(data.reduce((sum, day) => sum + day.focus, 0) / data.length).toFixed(1)}
          </span>
        </div>
        <div className="text-xs">
          <span className="font-medium text-base-content">Peak Day:</span>
          <span className="ml-1 text-green-600 font-semibold">
            {data.reduce((peak, day) => day.focus > peak.focus ? day : peak, data[0]).name}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

