import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Brain } from 'lucide-react'

export default function HabitChart({ habitPlan }) {
  // Mock data for Focus, Mood, and Energy trends over 7 days
  const data = [
    { name: 'Mon', focus: 7.2, mood: 6.8, energy: 7.5 },
    { name: 'Tue', focus: 8.1, mood: 7.3, energy: 8.2 },
    { name: 'Wed', focus: 8.5, mood: 8.0, energy: 7.8 },
    { name: 'Thu', focus: 7.8, mood: 7.6, energy: 8.5 },
    { name: 'Fri', focus: 8.9, mood: 8.4, energy: 9.1 },
    { name: 'Sat', focus: 7.3, mood: 7.8, energy: 7.2 },
    { name: 'Sun', focus: 8.2, mood: 8.2, energy: 8.8 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-sm rounded-lg p-4 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-base-content">Cognitive Metrics</h2>
      </div>
      
      {/* Chart Section */}
      <div className="flex-1 mb-3">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <YAxis 
              domain={[6, 10]}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name="Focus"
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8b5cf6" 
              strokeWidth={2.5}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#10b981" 
              strokeWidth={2.5}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-base-content/70">Focus</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-base-content/70">Mood</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-base-content/70">Energy</span>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-base-300">
        <div className="text-xs">
          <span className="font-medium text-base-content">Avg Focus:</span>
          <span className="ml-1 text-blue-600 font-semibold">8.1</span>
        </div>
        <div className="text-xs">
          <span className="font-medium text-base-content">Peak Day:</span>
          <span className="ml-1 text-green-600 font-semibold">Friday</span>
        </div>
      </div>
    </motion.div>
  )
}

