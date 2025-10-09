import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Smile, Frown, Meh, Zap, Calendar, TrendingUp, BarChart3 } from 'lucide-react'

export default function MoodTracker({ 
  habitLogId,
  className = ''
}) {
  const [currentMood, setCurrentMood] = useState('')
  const [moodNotes, setMoodNotes] = useState('')
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(3)
  const [moodHistory, setMoodHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const moodOptions = [
    {
      id: 'excited',
      label: 'Excited',
      emoji: '🤩',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      value: 9
    },
    {
      id: 'happy',
      label: 'Happy',
      emoji: '😊',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      value: 8
    },
    {
      id: 'content',
      label: 'Content',
      emoji: '😌',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      value: 7
    },
    {
      id: 'neutral',
      label: 'Neutral',
      emoji: '😐',
      color: 'from-gray-400 to-slate-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      value: 5
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '😴',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      value: 4
    },
    {
      id: 'stressed',
      label: 'Stressed',
      emoji: '😰',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      value: 3
    },
    {
      id: 'anxious',
      label: 'Anxious',
      emoji: '😟',
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      value: 2
    },
    {
      id: 'sad',
      label: 'Sad',
      emoji: '😢',
      color: 'from-slate-400 to-gray-500',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      value: 1
    }
  ]

  // Load mood history (mock data)
  useEffect(() => {
    const mockHistory = [
      { date: '2025-01-15', mood: 'happy', energy: 7, stress: 2, notes: 'Great meditation session' },
      { date: '2025-01-14', mood: 'content', energy: 6, stress: 3, notes: 'Productive day' },
      { date: '2025-01-13', mood: 'tired', energy: 4, stress: 5, notes: 'Long day at work' },
      { date: '2025-01-12', mood: 'excited', energy: 8, stress: 1, notes: 'Completed all habits!' },
      { date: '2025-01-11', mood: 'neutral', energy: 5, stress: 4, notes: 'Regular day' }
    ]
    setMoodHistory(mockHistory)
  }, [])

  const handleMoodSelect = (moodId) => {
    setCurrentMood(moodId)
  }

  const handleSaveMood = async () => {
    if (!currentMood) {
      alert('Please select a mood first')
      return
    }

    const moodData = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      energy: energyLevel,
      stress: stressLevel,
      notes: moodNotes,
      habitLogId: habitLogId
    }

    try {
      // In real app, would save to backend
      console.log('Saving mood data:', moodData)
      
      // Add to history
      setMoodHistory(prev => [moodData, ...prev.slice(0, 6)])
      
      // Reset form
      setMoodNotes('')
      setEnergyLevel(5)
      setStressLevel(3)
      
      alert('Mood saved successfully!')
    } catch (error) {
      console.error('Error saving mood:', error)
      alert('Failed to save mood. Please try again.')
    }
  }

  const selectedMood = moodOptions.find(m => m.id === currentMood)

  // Calculate mood trends
  const calculateTrends = () => {
    if (moodHistory.length < 2) return { trend: 'neutral', change: 0 }
    
    const recent = moodHistory.slice(0, 3)
    const older = moodHistory.slice(3, 6)
    
    const recentAvg = recent.reduce((sum, entry) => sum + (moodOptions.find(m => m.id === entry.mood)?.value || 5), 0) / recent.length
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + (moodOptions.find(m => m.id === entry.mood)?.value || 5), 0) / older.length : recentAvg
    
    const change = recentAvg - olderAvg
    const trend = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'neutral'
    
    return { trend, change: Math.abs(change) }
  }

  const trends = calculateTrends()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Mood Tracker</h3>
            <p className="text-sm text-base-content/70">Daily emotional check-in</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-ghost btn-sm"
        >
          <Calendar className="w-4 h-4" />
          History
        </motion.button>
      </div>

      {/* Mood Selection */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          <h4 className="text-lg font-bold text-base-content mb-4">How are you feeling today?</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {moodOptions.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border transition-all
                  ${currentMood === mood.id 
                    ? `${mood.bgColor} ${mood.borderColor} border-2 shadow-lg` 
                    : 'bg-base-100 border-base-300 hover:border-primary/50'
                  }
                `}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm font-medium text-base-content">{mood.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Energy & Stress Levels */}
          {currentMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="label">
                  <span className="label-text">Energy Level</span>
                  <span className="label-text-alt">{energyLevel}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="range range-primary range-sm"
                />
                <div className="flex justify-between text-xs text-base-content/60 px-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Stress Level</span>
                  <span className="label-text-alt">{stressLevel}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="range range-warning range-sm"
                />
                <div className="flex justify-between text-xs text-base-content/60 px-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text">Notes (optional)</span>
            </label>
            <textarea
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="What's contributing to how you feel today?"
              className="textarea textarea-bordered w-full h-20 resize-none"
            />
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveMood}
            disabled={!currentMood}
            className={`btn w-full ${
              currentMood 
                ? `bg-gradient-to-r ${selectedMood?.color} text-white border-none` 
                : 'btn-disabled'
            }`}
          >
            Save Mood Entry
          </motion.button>
        </div>
      </div>

      {/* Mood History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
          >
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-base-content">Mood History</h4>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${
                    trends.trend === 'up' ? 'text-green-500' :
                    trends.trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    trends.trend === 'up' ? 'text-green-500' :
                    trends.trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {trends.trend === 'up' ? 'Improving' :
                     trends.trend === 'down' ? 'Declining' :
                     'Stable'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {moodHistory.map((entry, index) => {
                  const mood = moodOptions.find(m => m.id === entry.mood)
                  return (
                    <motion.div
                      key={entry.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-lg ${mood?.bgColor} ${mood?.borderColor} border`}
                    >
                      <span className="text-2xl">{mood?.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-base-content">{mood?.label}</span>
                          <span className="text-sm text-base-content/60">{entry.date}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-base-content/70">
                          <span>⚡ {entry.energy}/10</span>
                          <span>😰 {entry.stress}/10</span>
                          {entry.notes && <span className="italic">"{entry.notes}"</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Insights */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          <h4 className="text-lg font-bold text-base-content mb-4">Mood Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">7.2</div>
              <div className="text-sm text-base-content/70">Average Mood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">6.8</div>
              <div className="text-sm text-base-content/70">Energy Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">3.2</div>
              <div className="text-sm text-base-content/70">Stress Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

