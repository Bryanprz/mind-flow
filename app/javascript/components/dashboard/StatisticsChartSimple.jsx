import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Target, 
  RefreshCw, 
  TrendingUp, 
  Activity,
  BarChart3
} from 'lucide-react'

export default function StatisticsChartSimple() {
  const [data, setData] = useState([])
  const [selectedScenario, setSelectedScenario] = useState('normal')
  const [isLive, setIsLive] = useState(true)

  // Generate realistic data based on scenario
  const generateData = (scenario) => {
    const hours = Array.from({ length: 16 }, (_, i) => i + 7) // 7 AM to 10 PM
    const scenarios = {
      busy: { baseMultiplier: 0.3, variation: 0.4, peakHours: [9, 10, 11, 14, 15, 16] },
      quiet: { baseMultiplier: 0.8, variation: 0.2, peakHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
      emergency: { baseMultiplier: 0.1, variation: 0.6, peakHours: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
      custom: { baseMultiplier: 0.6, variation: 0.3, peakHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
      normal: { baseMultiplier: 0.5, variation: 0.3, peakHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] }
    }
    
    const config = scenarios[scenario] || scenarios.normal
    
    return hours.map(hour => {
      const isPeakHour = config.peakHours.includes(hour)
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
      
      // Base values with scenario adjustments
      let baseValue = 50
      if (isPeakHour) baseValue *= 1.5
      if (timeOfDay === 'morning') baseValue *= 1.2
      if (timeOfDay === 'afternoon') baseValue *= 1.3
      if (timeOfDay === 'evening') baseValue *= 0.8
      
      baseValue *= config.baseMultiplier
      
      // Add realistic variation
      const primaryVariation = (Math.random() - 0.5) * 20 * config.variation
      const secondaryVariation = (Math.random() - 0.5) * 15 * config.variation
      const volumeVariation = (Math.random() - 0.5) * 30 * config.variation
      
      const primaryValue = Math.max(2, baseValue + primaryVariation)
      const secondaryValue = Math.max(1, baseValue * 0.7 + secondaryVariation)
      const volumeValue = Math.max(10, baseValue * 2 + volumeVariation)
      
      return {
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        primary: Math.round(primaryValue),
        secondary: Math.round(secondaryValue),
        volume: Math.round(volumeValue),
        energy: Math.round(volumeValue * 0.8),
        focus: Math.round(primaryValue),
        clarity: Math.round(secondaryValue)
      }
    })
  }

  useEffect(() => {
    setData(generateData(selectedScenario))
  }, [selectedScenario])

  // Live updates
  useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setData(prevData => prevData.map(item => ({
        ...item,
        primary: Math.max(2, Math.min(100, item.primary + (Math.random() - 0.5) * 3)),
        secondary: Math.max(1, Math.min(95, item.secondary + (Math.random() - 0.5) * 2)),
        volume: Math.max(10, Math.min(200, item.volume + (Math.random() - 0.5) * 5))
      })))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [isLive])

  const scenarios = [
    { key: 'normal', label: 'Balanced Mind', icon: Brain, color: '#3b82f6' },
    { key: 'busy', label: 'Deep Focus', icon: Target, color: '#8b5cf6' },
    { key: 'quiet', label: 'Calm Flow', icon: Activity, color: '#10b981' },
    { key: 'emergency', label: 'Crisis Mode', icon: Zap, color: '#ef4444' },
    { key: 'custom', label: 'Custom', icon: BarChart3, color: '#f59e0b' }
  ]

  // Calculate chart dimensions
  const chartWidth = 800
  const chartHeight = 400
  const margin = { top: 20, right: 30, bottom: 40, left: 50 }
  const innerWidth = chartWidth - margin.left - margin.right
  const innerHeight = chartHeight - margin.top - margin.bottom

  // Calculate scales
  const maxValue = Math.max(...data.map(d => Math.max(d.primary, d.secondary, d.volume)))
  const xScale = (index) => margin.left + (index / (data.length - 1)) * innerWidth
  const yScale = (value) => margin.top + innerHeight - (value / maxValue) * innerHeight

  // Generate path data for lines
  const primaryPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.primary)}`).join(' ')
  const secondaryPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.secondary)}`).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Simple SVG Chart</h3>
            <p className="text-blue-200">Pure SVG visualization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Scenario Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Mode:</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {scenarios.map(scenario => (
                <option key={scenario.key} value={scenario.key}>
                  {scenario.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Live Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[400px] relative">
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = margin.top + (i / 5) * innerHeight
            return (
              <line
                key={i}
                x1={margin.left}
                y1={y}
                x2={margin.left + innerWidth}
                y2={y}
                stroke="#374151"
                strokeOpacity={0.3}
                strokeDasharray="2,4"
              />
            )
          })}
          
          {/* Volume bars */}
          {data.map((d, i) => (
            <rect
              key={`volume-${i}`}
              x={xScale(i) - 8}
              y={yScale(d.volume)}
              width={16}
              height={chartHeight - margin.bottom - yScale(d.volume)}
              fill="#10b981"
              opacity={0.3}
            />
          ))}
          
          {/* Primary line */}
          <path
            d={primaryPath}
            stroke="#3b82f6"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Secondary line */}
          <path
            d={secondaryPath}
            stroke="#8b5cf6"
            strokeWidth={3}
            strokeDasharray="8,4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={`points-${i}`}>
              <circle
                cx={xScale(i)}
                cy={yScale(d.primary)}
                r={4}
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth={2}
                className="hover:r-6 transition-all cursor-pointer"
              />
              <circle
                cx={xScale(i)}
                cy={yScale(d.secondary)}
                r={4}
                fill="#8b5cf6"
                stroke="#7c3aed"
                strokeWidth={2}
                className="hover:r-6 transition-all cursor-pointer"
              />
            </g>
          ))}
          
          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={chartHeight - margin.bottom}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          
          {/* X-axis */}
          <line
            x1={margin.left}
            y1={chartHeight - margin.bottom}
            x2={margin.left + innerWidth}
            y2={chartHeight - margin.bottom}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const value = Math.round((maxValue / 5) * (5 - i))
            const y = margin.top + (i / 5) * innerHeight
            return (
              <text
                key={i}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="12"
                fontWeight="600"
              >
                {value}
              </text>
            )
          })}
          
          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={chartHeight - margin.bottom + 20}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="12"
              fontWeight="600"
            >
              {d.time}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-300">Focus Intensity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-300">Mental Clarity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-300">Energy Reserves</span>
        </div>
      </div>
    </motion.div>
  )
}
