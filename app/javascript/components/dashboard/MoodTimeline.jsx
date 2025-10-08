import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Heart, Smile, Meh, Frown, Zap } from 'lucide-react'

export default function MoodTimeline({ currentUser }) {
  // Mock mood data with timestamps and emotions
  const moodData = [
    { time: '6:00', mood: 8.5, emotion: 'happy', note: 'Morning energy' },
    { time: '9:00', mood: 7.8, emotion: 'calm', note: 'Focus time' },
    { time: '12:00', mood: 6.2, emotion: 'neutral', note: 'Lunch break' },
    { time: '15:00', mood: 7.5, emotion: 'energized', note: 'Afternoon boost' },
    { time: '18:00', mood: 8.8, emotion: 'happy', note: 'Work done' },
    { time: '21:00', mood: 9.2, emotion: 'calm', note: 'Relaxing' },
  ]

  const emotionIcons = {
    happy: Smile,
    calm: Heart,
    neutral: Meh,
    energized: Zap,
    stressed: Frown,
    sad: Frown
  }

  const emotionColors = {
    happy: '#10B981',
    calm: '#8B5CF6',
    neutral: '#6B7280',
    energized: '#F59E0B',
    stressed: '#EF4444',
    sad: '#8B5CF6'
  }

  const getGradientColors = (mood) => {
    if (mood >= 8) return ['#10B981', '#059669']
    if (mood >= 6) return ['#F59E0B', '#D97706']
    return ['#EF4444', '#DC2626']
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 h-full"
    >
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-purple-600" />
          Mood Timeline
        </h2>
        
        <div className="flex-1 flex flex-col">
          {/* Emotion indicators */}
          <div className="flex justify-between items-center mb-4 px-2">
            {moodData.map((data, index) => {
              const Icon = emotionIcons[data.emotion]
              const color = emotionColors[data.emotion]
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{data.time}</span>
                </motion.div>
              )
            })}
          </div>

          {/* Curved mood chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  stroke="#6B7280"
                />
                <YAxis 
                  domain={[5, 10]}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  stroke="#6B7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name) => [value, 'Mood']}
                  labelFormatter={(time) => `Time: ${time}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fill="url(#moodGradient)"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Current mood summary */}
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Current Mood</div>
                  <div className="text-xs text-gray-600">Feeling calm and relaxed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">9.2</div>
                <div className="text-xs text-gray-500">/ 10</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
