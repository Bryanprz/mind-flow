import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Line } from '@visx/visx'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { scaleLinear, scaleBand } from '@visx/scale'
import { curveMonotoneX } from '@visx/curve'
import { localPoint } from '@visx/event'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import { 
  Brain, 
  Zap, 
  Target, 
  RefreshCw, 
  TrendingUp, 
  Activity,
  BarChart3
} from 'lucide-react'

// Chart dimensions
const chartHeight = 400
const margin = { top: 20, right: 30, bottom: 40, left: 50 }

export default function StatisticsChartVisxMinimal() {
  const [data, setData] = useState([])
  const [selectedScenario, setSelectedScenario] = useState('normal')
  const [isLive, setIsLive] = useState(true)
  
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip()

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

  // Scales
  const xScale = useMemo(() => 
    scaleBand({
      domain: data.map(d => d.time),
      range: [margin.left, 800 - margin.right],
      padding: 0.1,
    }), [data]
  )

  const yScale = useMemo(() => 
    scaleLinear({
      domain: [0, Math.max(...data.map(d => Math.max(d.primary, d.secondary, d.volume)))],
      range: [chartHeight - margin.bottom, margin.top],
      nice: true,
    }), [data]
  )

  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event)
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum,
    })
  }

  const scenarios = [
    { key: 'normal', label: 'Balanced Mind', icon: Brain, color: '#3b82f6' },
    { key: 'busy', label: 'Deep Focus', icon: Target, color: '#8b5cf6' },
    { key: 'quiet', label: 'Calm Flow', icon: Activity, color: '#10b981' },
    { key: 'emergency', label: 'Crisis Mode', icon: Zap, color: '#ef4444' },
    { key: 'custom', label: 'Custom', icon: BarChart3, color: '#f59e0b' }
  ]

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
            <h3 className="text-2xl font-bold text-white">Visx Line Chart</h3>
            <p className="text-blue-200">Clean line visualization</p>
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
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={800 - margin.left - margin.right}
            left={margin.left}
            stroke="#374151"
            strokeOpacity={0.3}
            strokeDasharray="2,4"
          />
          <GridColumns
            scale={xScale}
            height={chartHeight - margin.top - margin.bottom}
            top={margin.top}
            stroke="#374151"
            strokeOpacity={0.3}
            strokeDasharray="2,4"
          />
          
          {/* Primary Line */}
          <Line
            data={data}
            x={d => xScale(d.time) + xScale.bandwidth() / 2}
            y={d => yScale(d.primary)}
            stroke="#3b82f6"
            strokeWidth={3}
            curve={curveMonotoneX}
            onMouseOver={(event) => handleMouseOver(event, data[0])}
          />
          
          {/* Secondary Line */}
          <Line
            data={data}
            x={d => xScale(d.time) + xScale.bandwidth() / 2}
            y={d => yScale(d.secondary)}
            stroke="#8b5cf6"
            strokeWidth={3}
            strokeDasharray="8,4"
            curve={curveMonotoneX}
            onMouseOver={(event) => handleMouseOver(event, data[0])}
          />
          
          {/* Data Points */}
          {data.map((d, i) => (
            <g key={`points-${i}`}>
              <circle
                cx={xScale(d.time) + xScale.bandwidth() / 2}
                cy={yScale(d.primary)}
                r={4}
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth={2}
                className="hover:r-6 transition-all cursor-pointer"
                onMouseOver={(event) => handleMouseOver(event, d)}
              />
              <circle
                cx={xScale(d.time) + xScale.bandwidth() / 2}
                cy={yScale(d.secondary)}
                r={4}
                fill="#8b5cf6"
                stroke="#7c3aed"
                strokeWidth={2}
                className="hover:r-6 transition-all cursor-pointer"
                onMouseOver={(event) => handleMouseOver(event, d)}
              />
            </g>
          ))}
          
          {/* Axes */}
          <AxisLeft
            scale={yScale}
            left={margin.left}
            tickStroke="#9ca3af"
            tickLabelProps={{
              fill: '#9ca3af',
              fontSize: 12,
              textAnchor: 'end',
              dx: -10,
            }}
          />
          <AxisBottom
            scale={xScale}
            top={chartHeight - margin.bottom}
            tickStroke="#9ca3af"
            tickLabelProps={{
              fill: '#9ca3af',
              fontSize: 12,
              textAnchor: 'middle',
            }}
          />
        </svg>
        
        {/* Tooltip */}
        {tooltipOpen && tooltipData && (
          <TooltipWithBounds
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <div className="space-y-2">
              <div className="font-bold text-white">{tooltipData.time}</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Focus: {tooltipData.primary}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Clarity: {tooltipData.secondary}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Energy: {tooltipData.volume}%</span>
              </div>
            </div>
          </TooltipWithBounds>
        )}
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
