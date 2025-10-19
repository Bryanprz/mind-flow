import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'
import { TrendingUp, Brain, Zap, Target, RefreshCw } from 'lucide-react'

export default function FocusTrendsChart() {
  const [data, setData] = useState([])
  const [isLive, setIsLive] = useState(true)
  const [selectedMetrics, setSelectedMetrics] = useState(['focus', 'clarity', 'energy'])

  // Generate 7 days of realistic focus data
  useEffect(() => {
    const generateData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const newData = []
      
      days.forEach((day, index) => {
        const isWeekend = index >= 5
        const isPeakDay = index === 2 || index === 3 // Wed, Thu
        
        // Create realistic daily patterns
        const baseFocus = isWeekend ? 45 : (isPeakDay ? 85 : 70)
        const baseClarity = isWeekend ? 50 : (isPeakDay ? 80 : 65)
        const baseEnergy = isWeekend ? 60 : (isPeakDay ? 90 : 75)
        
        // Add some variation
        const focusVariation = (Math.random() - 0.5) * 15
        const clarityVariation = (Math.random() - 0.5) * 12
        const energyVariation = (Math.random() - 0.5) * 10
        
        // Add distraction events (red dots)
        const distractionEvents = Math.floor(Math.random() * 3)
        
        newData.push({
          day,
          focus: Math.max(20, Math.min(100, baseFocus + focusVariation)),
          clarity: Math.max(25, Math.min(95, baseClarity + clarityVariation)),
          energy: Math.max(30, Math.min(100, baseEnergy + energyVariation)),
          distractions: distractionEvents,
          date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()
        })
      })
      
      return newData
    }
    
    setData(generateData())
  }, [])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setData(prevData => prevData.map(day => ({
        ...day,
        focus: Math.max(20, Math.min(100, day.focus + (Math.random() - 0.5) * 2)),
        clarity: Math.max(25, Math.min(95, day.clarity + (Math.random() - 0.5) * 1.5)),
        energy: Math.max(30, Math.min(100, day.energy + (Math.random() - 0.5) * 1))
      })))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isLive])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold text-lg">{label}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-300 capitalize">{entry.dataKey}</span>
                </div>
                <span className="text-white font-bold text-lg">{Math.round(entry.value)}%</span>
              </div>
            ))}
            {payload[0]?.payload?.distractions > 0 && (
              <div className="pt-2 border-t border-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-400">
                    {payload[0].payload.distractions} distraction{payload[0].payload.distractions > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props
    const isHighValue = payload[dataKey] > 80
    const isLowValue = payload[dataKey] < 40
    
    return (
      <g>
        {/* Glow effect for high values */}
        {isHighValue && (
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill={dataKey === 'focus' ? '#3b82f6' : dataKey === 'clarity' ? '#8b5cf6' : '#10b981'}
            opacity={0.3}
            className="animate-pulse"
          />
        )}
        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={isHighValue ? 6 : isLowValue ? 3 : 4}
          fill={dataKey === 'focus' ? '#3b82f6' : dataKey === 'clarity' ? '#8b5cf6' : '#10b981'}
          stroke="#1f2937"
          strokeWidth={2}
          className="transition-all duration-300"
        />
        {/* Distraction indicators */}
        {payload.distractions > 0 && (
          <circle
            cx={cx + 12}
            cy={cy - 8}
            r={3}
            fill="#ef4444"
            className="animate-pulse"
          />
        )}
      </g>
    )
  }

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Focus Trends</h3>
            <p className="text-sm text-gray-400">7-day cognitive performance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Metric toggles */}
          <div className="flex items-center gap-2">
            {[
              { key: 'focus', label: 'Focus', color: '#3b82f6', icon: Brain },
              { key: 'clarity', label: 'Clarity', color: '#8b5cf6', icon: Target },
              { key: 'energy', label: 'Energy', color: '#10b981', icon: Zap }
            ].map(({ key, label, color, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggleMetric(key)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedMetrics.includes(key)
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3 h-3" style={{ color }} />
                {label}
              </button>
            ))}
          </div>
          
          {/* Live toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isLive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[250px] max-h-[300px] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 20, left: 15, bottom: 15 }}
          >
            <defs>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="clarityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="#374151" 
              strokeOpacity={0.3}
            />
            
            <XAxis 
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: '600' }}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: '600' }}
              domain={[0, 100]}
              tickCount={6}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines */}
            <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.3} />
            
            {/* Lines */}
            {selectedMetrics.includes('focus') && (
              <Line
                type="monotone"
                dataKey="focus"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 8, stroke: '#1e40af', strokeWidth: 3 }}
                connectNulls={false}
              />
            )}
            
            {selectedMetrics.includes('clarity') && (
              <Line
                type="monotone"
                dataKey="clarity"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={<CustomDot />}
                activeDot={{ r: 8, stroke: '#7c3aed', strokeWidth: 3 }}
                connectNulls={false}
              />
            )}
            
            {selectedMetrics.includes('energy') && (
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="4 8"
                dot={<CustomDot />}
                activeDot={{ r: 8, stroke: '#059669', strokeWidth: 3 }}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-4">
          {selectedMetrics.map(metric => {
            const config = {
              focus: { label: 'Focus', color: '#3b82f6' },
              clarity: { label: 'Clarity', color: '#8b5cf6' },
              energy: { label: 'Energy', color: '#10b981' }
            }[metric]
            
            return (
              <div key={metric} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: config.color }}
                ></div>
                <span className="text-sm text-gray-300">{config.label}</span>
              </div>
            )
          })}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live • 7 days</span>
        </div>
      </div>
    </motion.div>
  )
}
