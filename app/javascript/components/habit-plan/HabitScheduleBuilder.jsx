import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Clock, Target, CheckCircle, TrendingUp } from 'lucide-react'
import HabitCard from './HabitCard'

// Helper function to clean ActionText content
const cleanActionTextContent = (content) => {
  if (!content) return ''
  
  // Remove ActionText HTML comments and wrapper divs
  return content
    .replace(/<!-- BEGIN app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- END app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- BEGIN \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<!-- END \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<div class="trix-content">/g, '')
    .replace(/<\/div>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function HabitScheduleBuilder({ 
  habits = [],
  onToggleHabit,
  onAddNewHabit,
  className = ''
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Mind',
    frequency: 'Daily',
    reminderTime: ''
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Enhanced mock habit data with realistic completion patterns
  const mockHabits = habits.length > 0 ? habits : [
    { 
      id: 1, 
      name: 'Start your day with vigorous movement — brisk walking, dancing, or yoga', 
      category: 'Quick Wins', 
      icon: '🎯', 
      completed: [true, true, false, true, true, false, true],
      streak: 3,
      weeklyGoal: 5
    },
    { 
      id: 2, 
      name: 'Choose light, spicy foods over heavy, oily meals to awaken digestion', 
      category: 'Quick Wins', 
      icon: '🎯', 
      completed: [true, true, true, false, true, true, false],
      streak: 2,
      weeklyGoal: 6
    },
    { 
      id: 3, 
      name: 'Avoid oversleeping — wake up by sunrise to boost energy', 
      category: 'Quick Wins', 
      icon: '🎯', 
      completed: [true, true, true, true, true, true, true],
      streak: 7,
      weeklyGoal: 7
    },
    { 
      id: 4, 
      name: 'Declutter your space to refresh the mind and lighten emotional weight', 
      category: 'Quick Wins', 
      icon: '🎯', 
      completed: [false, true, true, false, true, false, true],
      streak: 1,
      weeklyGoal: 4
    }
  ]

  const handleToggleHabit = (habitId, dayIndex) => {
    if (onToggleHabit) {
      onToggleHabit(habitId, dayIndex)
    }
  }

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      if (onAddNewHabit) {
        onAddNewHabit(newHabit)
      }
      setNewHabit({ name: '', category: 'Mind', frequency: 'Daily', reminderTime: '' })
      setShowAddModal(false)
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Mind': return 'from-blue-500 to-purple-500'
      case 'Body': return 'from-green-500 to-emerald-500'
      case 'Lifestyle': return 'from-orange-500 to-red-500'
      case 'Sleep': return 'from-indigo-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Habit Schedule</h3>
            <p className="text-sm text-base-content/70">Weekly planning & tracking</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus className="w-4 h-4" />
          New Habit
        </motion.button>
      </div>

      {/* Modern Card-Based Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {mockHabits.map((habit, index) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            index={index}
            onToggleHabit={handleToggleHabit}
            weekDays={weekDays}
          />
        ))}
      </div>

      {/* Enhanced Weekly Summary */}
      <div className="card bg-base-100/90 backdrop-blur-xl border border-base-300/30 shadow-lg mt-6">
        <div className="card-body p-6">
          <div className="mt-6 pt-4 border-t border-base-300">
            <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '3fr repeat(7, 0.8fr)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-sm font-medium text-base-content">
                    Weekly Progress
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  {mockHabits.length > 0 ? Math.round((mockHabits.reduce((total, habit) => 
                    total + habit.completed.filter(Boolean).length, 0) / 
                    (mockHabits.length * 7)) * 100) : 0}%
                </div>
                <div className="text-xs text-base-content/60">
                  {mockHabits.reduce((total, habit) => 
                    total + habit.completed.filter(Boolean).length, 0)} of {mockHabits.length * 7} habits completed
                </div>
              </div>
              {weekDays.map((day, index) => {
                const completedCount = mockHabits.filter(habit => habit.completed[index]).length
                const completionRate = (completedCount / mockHabits.length) * 100
                const isToday = index === new Date().getDay() - 1
                
                return (
                  <motion.div 
                    key={day} 
                    className={`text-center p-2 rounded-lg ${isToday ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30' : 'hover:bg-base-200/30'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs text-base-content/60 mb-1">{day}</div>
                    <div className={`text-lg font-bold ${completionRate === 100 ? 'text-emerald-400' : completionRate >= 75 ? 'text-blue-400' : completionRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {completedCount}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                      <motion.div 
                        className="h-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Motivational Stats Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-4 rounded-xl border border-emerald-400/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-400">
                    {mockHabits.filter(h => h.completed.every(Boolean)).length}
                  </div>
                  <div className="text-xs text-base-content/70">Perfect Days</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-400/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {mockHabits.length > 0 ? Math.max(...mockHabits.map(h => h.streak || 0)) : 0} days
                  </div>
                  <div className="text-xs text-base-content/70">Longest Streak</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-400/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {mockHabits.reduce((acc, h) => acc + h.completed.filter(Boolean).length, 0)}
                  </div>
                  <div className="text-xs text-base-content/70">Total Completions</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card bg-base-100 shadow-2xl max-w-md mx-4 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-6">
                <h3 className="text-lg font-bold mb-4">Add New Habit</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Habit Name</span>
                    </label>
                    <input
                      type="text"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                      placeholder="e.g., 5-minute meditation"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                      className="select select-bordered w-full"
                    >
                      <option value="Mind">Mind</option>
                      <option value="Body">Body</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Sleep">Sleep</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Frequency</span>
                    </label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                      className="select select-bordered w-full"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Reminder Time (Optional)</span>
                    </label>
                    <input
                      type="time"
                      value={newHabit.reminderTime}
                      onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddHabit}
                    className="btn btn-primary flex-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Habit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
