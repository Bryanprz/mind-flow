import React, { useState, useMemo, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts'

export default function StatisticsChart({ selectedDate, timeRange, timeInterval }) {
  const [scenario, setScenario] = useState(() => {
    return localStorage.getItem('chartScenario') || 'normal'
  })
  const [customPeakHours, setCustomPeakHours] = useState(() => {
    return JSON.parse(localStorage.getItem('customPeakHours') || '[]')
  })
  const [volumeMultiplier, setVolumeMultiplier] = useState(() => {
    return parseFloat(localStorage.getItem('volumeMultiplier') || '1.0')
  })

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('chartScenario', scenario)
  }, [scenario])

  useEffect(() => {
    localStorage.setItem('customPeakHours', JSON.stringify(customPeakHours))
  }, [customPeakHours])

  useEffect(() => {
    localStorage.setItem('volumeMultiplier', volumeMultiplier.toString())
  }, [volumeMultiplier])

  // Generate mock data based on selected date and time interval
  const chartData = useMemo(() => {
    const data = []
    const startHour = 7
    const endHour = 22
    const intervalHours = parseInt(timeInterval.replace('h', ''))
    
    for (let hour = startHour; hour <= endHour; hour += intervalHours) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const displayTime = hour >= 12 ? `${hour === 12 ? 12 : hour - 12}:00 ${hour >= 12 ? 'PM' : 'AM'}` : `${hour}:00 AM`
      
      // Generate data based on selected scenario
      let peakHours = [9, 10, 11, 14, 15, 16, 19, 20] // Default peak hours
      let baseValue
      
      switch (scenario) {
        case 'busy':
          peakHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          baseValue = 25 + Math.sin((hour - 7) * 0.3) * 10
          break
        case 'quiet':
          peakHours = [12, 13]
          baseValue = 8 + Math.sin((hour - 7) * 0.2) * 4
          break
        case 'emergency':
          peakHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
          baseValue = 40 + Math.sin((hour - 7) * 0.5) * 15
          break
        case 'custom':
          peakHours = customPeakHours.length > 0 ? customPeakHours : [9, 10, 11, 14, 15, 16, 19, 20]
          baseValue = 20 + Math.sin((hour - 7) * 0.3) * 8
          break
        default: // normal
          baseValue = 15 + Math.sin((hour - 7) * 0.2) * 6
      }
      
      const isPeakHour = peakHours.includes(hour)
      const isRushHour = hour >= 17 && hour <= 19
      
      if (isRushHour) {
        baseValue += 1.0
      } else if (isPeakHour) {
        baseValue += 0.8
      }
      
      const randomVariation = (Math.random() - 0.5) * 8
      const primaryValue = Math.max(2, baseValue + randomVariation)
      
      // Secondary data (clarity) - create its own pattern
      const clarityBase = baseValue * 0.7 + Math.sin((hour - 7) * 0.4) * 5
      const clarityVariation = (Math.random() - 0.5) * 4
      const secondaryValue = Math.max(1, clarityBase + clarityVariation)
      
      // Volume bars (call volume) - affected by volume multiplier
      const volumeValue = Math.max(5, primaryValue * 12 * volumeMultiplier + Math.random() * 20)
      
      data.push({
        time: time,
        displayTime: displayTime,
        primary: Math.round(primaryValue * 10) / 10,
        secondary: Math.round(secondaryValue * 10) / 10,
        volume: Math.round(volumeValue),
        hour: hour,
        isPeak: isPeakHour
      })
    }
    
    return data
  }, [selectedDate, timeInterval, scenario, customPeakHours, volumeMultiplier])

  const [activeIndex, setActiveIndex] = useState(null)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="theme-glass-card border border-cyan-400/30 rounded-xl shadow-2xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <p className="theme-text-primary font-bold text-lg">{label}</p>
            {data.isPeak && (
              <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold border border-yellow-400/30">
                PEAK
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm theme-text-accent">Focus Intensity</span>
              </div>
              <span className="theme-text-primary font-bold text-lg">{payload[0].value}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm theme-text-accent">Mental Clarity</span>
              </div>
              <span className="theme-text-primary font-bold text-lg">{payload[1].value}</span>
            </div>
            {payload[2] && (
              <div className="flex items-center justify-between pt-2 border-t border-cyan-400/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm theme-text-accent">Energy Reserves</span>
                </div>
                <span className="theme-text-primary font-bold text-lg">{payload[2].value}</span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props) => {
    const { cx, cy, payload, index } = props
    const isActive = activeIndex === index
    const isPeak = payload.isPeak
    
    return (
      <g>
        {/* Glow effect for peak hours */}
        {isPeak && (
          <circle
            cx={cx}
            cy={cy}
            r={isActive ? 12 : 10}
            fill="#fbbf24"
            opacity={0.3}
            className="animate-pulse"
          />
        )}
        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 8 : (isPeak ? 6 : 5)}
          fill={isPeak ? '#fbbf24' : (payload.primary > payload.secondary ? '#3b82f6' : '#8b5cf6')}
          stroke={isActive ? '#1e40af' : (isPeak ? '#fbbf24' : '#374151')}
          strokeWidth={isActive ? 4 : (isPeak ? 3 : 2)}
          className="transition-all duration-300 cursor-pointer hover:scale-125"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        />
        {/* Inner highlight */}
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 3 : 2}
          fill="#374151"
          opacity={0.8}
        />
      </g>
    )
  }

  const CustomBar = (props) => {
    const { cx, cy, width, height, payload } = props
    const isPeak = payload.isPeak
    
    return (
      <g>
        {/* Glow effect for peak hours */}
        {isPeak && (
          <rect
            x={cx - width/2 - 2}
            y={cy - height - 2}
            width={width + 4}
            height={height + 4}
            fill="#fbbf24"
            fillOpacity={0.2}
            rx={4}
            shapeRendering="geometricPrecision"
            className="animate-pulse"
          />
        )}
        {/* Main bar */}
        <rect
          x={cx - width/2}
          y={cy - height}
          width={width}
          height={height}
          fill={isPeak ? '#fbbf24' : '#06b6d4'}
          rx={4}
          shapeRendering="geometricPrecision"
          className="transition-all duration-300 hover:brightness-110"
        />
        {/* Gradient overlay */}
        <defs>
          <linearGradient id={`barGradient-${cx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPeak ? 'hsl(var(--w))' : 'hsl(var(--a))'} stopOpacity={1}/>
            <stop offset="100%" stopColor={isPeak ? 'hsl(var(--w))' : 'hsl(var(--a))'} stopOpacity={0.7}/>
          </linearGradient>
        </defs>
      </g>
    )
  }
  
  const togglePeakHour = (hour) => {
    if (customPeakHours.includes(hour)) {
      setCustomPeakHours(customPeakHours.filter(h => h !== hour))
    } else {
      setCustomPeakHours([...customPeakHours, hour])
    }
  }

  return (
    <div className="w-full h-full relative theme-glass-card p-4 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
      {/* Compact Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-3">
        <select 
          value={scenario} 
          onChange={(e) => setScenario(e.target.value)}
          className="text-xs theme-glass-card-sm border border-cyan-400/30 rounded px-3 py-1 text-white"
        >
          <option value="normal">Balanced Mind</option>
          <option value="busy">Peak Performance</option>
          <option value="quiet">Recovery Mode</option>
          <option value="emergency">Flow State</option>
          <option value="custom">Custom</option>
        </select>
        
        <div className="flex items-center space-x-2 theme-glass-card-sm rounded px-3 py-1">
          <span className="text-xs theme-text-accent">Energy:</span>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={volumeMultiplier}
            onChange={(e) => setVolumeMultiplier(parseFloat(e.target.value))}
            className="w-16 h-1"
          />
          <span className="text-xs font-medium theme-text-primary">{volumeMultiplier.toFixed(1)}x</span>
        </div>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-lg blur-sm"></div>
      
      <ResponsiveContainer 
        width="100%" 
        height={256}
        style={{
          shapeRendering: 'geometricPrecision',
          textRendering: 'optimizeLegibility'
        }}
      >
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onMouseMove={(data) => setActiveIndex(data?.activeTooltipIndex)}
          onMouseLeave={() => setActiveIndex(null)}
          style={{ 
            shapeRendering: 'geometricPrecision',
            textRendering: 'optimizeLegibility'
          }}
        >
          <defs>
            {/* Dramatic gradients */}
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="2 4" 
            stroke="#64748b" 
            vertical={false}
            strokeWidth={1}
            strokeOpacity={0.3}
            shapeRendering="geometricPrecision"
          />
          
          <XAxis 
            dataKey="displayTime"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#64748b', 
              fontSize: 11,
              fontFamily: 'system-ui',
              fontWeight: '600',
              textRendering: 'optimizeLegibility'
            }}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#64748b', 
              fontSize: 11,
              fontFamily: 'system-ui',
              fontWeight: '600',
              textRendering: 'optimizeLegibility'
            }}
            domain={[0, 60]}
            tickCount={6}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Volume bars in background */}
          <Bar
            dataKey="volume"
            fill="url(#volumeGradient)"
            opacity={0.3}
            radius={[2, 2, 0, 0]}
            maxBarSize={20}
            shapeRendering="geometricPrecision"
          />
          
          {/* Primary area (Active Calls) */}
          <Area
            type="monotone"
            dataKey="primary"
            stroke="#3b82f6"
            strokeWidth={4}
            fill="url(#primaryGradient)"
            dot={<CustomDot />}
            activeDot={{ 
              r: 10, 
              stroke: '#1e40af', 
              strokeWidth: 4,
              fill: '#3b82f6'
            }}
            connectNulls={false}
            shapeRendering="geometricPrecision"
          />
          
          {/* Secondary line (Queue) */}
          <Line
            type="monotone"
            dataKey="secondary"
            stroke="#8b5cf6"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={false}
            activeDot={{ 
              r: 8, 
              stroke: '#7c3aed', 
              strokeWidth: 3,
              fill: '#8b5cf6'
            }}
            connectNulls={false}
            shapeRendering="geometricPrecision"
          />
          
          {/* Multiple reference lines for context */}
          <ReferenceLine 
            y={3.5} 
            stroke="#fbbf24" 
            strokeDasharray="4 4"
            strokeWidth={2}
            opacity={0.6}
          />
          <ReferenceLine 
            y={2.0} 
            stroke="#64748b" 
            strokeDasharray="2 2"
            strokeWidth={1}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Clean legend */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs theme-text-accent">Focus</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs theme-text-accent">Clarity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-xs theme-text-accent">Energy</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs theme-text-accent">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live • {timeInterval}</span>
        </div>
      </div>
    </div>
  )
}
