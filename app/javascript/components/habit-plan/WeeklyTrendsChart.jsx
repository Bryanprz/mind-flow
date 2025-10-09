import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'

const WeeklyTrendsChart = ({ className = '' }) => {
  // Mock data for focus vs calm trends over 7 days
  const data = [
    { day: 'Mon', focus: 85, calm: 72 },
    { day: 'Tue', focus: 78, calm: 80 },
    { day: 'Wed', focus: 92, calm: 68 },
    { day: 'Thu', focus: 88, calm: 75 },
    { day: 'Fri', focus: 95, calm: 82 },
    { day: 'Sat', focus: 70, calm: 90 },
    { day: 'Sun', focus: 82, calm: 85 }
  ]

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="calmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          {/* Grid - subtle */}
          <CartesianGrid 
            strokeDasharray="1 3" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth={0.5}
          />
          
          {/* X-axis - hidden for clean look */}
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
            interval="preserveStartEnd"
          />
          
          {/* Y-axis - hidden for clean look */}
          <YAxis 
            axisLine={false}
            tickLine={false}
            domain={[60, 100]}
            hide
          />
          
          {/* Focus Area */}
          <Area
            type="monotone"
            dataKey="focus"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#focusGradient)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
          />
          
          {/* Calm Area */}
          <Area
            type="monotone"
            dataKey="calm"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#calmGradient)"
            strokeDasharray="3 3"
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#8B5CF6', strokeWidth: 2, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyTrendsChart
