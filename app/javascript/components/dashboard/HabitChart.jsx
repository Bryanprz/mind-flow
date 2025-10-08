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
      className="card bg-base-100 border border-gray-300 h-full"
    >
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          Cognitive Metrics
        </h2>
        
        <ResponsiveContainer width="100%" height={250}>
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
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              domain={[6, 10]}
              tick={{ fontSize: 12 }}
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
            <Legend />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Focus"
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm">
            <span className="font-semibold">Avg Focus:</span>
            <span className="ml-2 text-blue-600">8.1</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Peak Day:</span>
            <span className="ml-2 text-green-600">Friday</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

