import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Clock, Target, CheckCircle } from 'lucide-react'

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
  
  // Mock habit data for demonstration
  const mockHabits = habits.length > 0 ? habits : [
    { id: 1, name: 'Meditation', category: 'Mind', icon: '🧘‍♂️', completed: [true, true, false, true, true, false, true] },
    { id: 2, name: 'Journaling', category: 'Mind', icon: '✍️', completed: [true, true, true, false, true, true, false] },
    { id: 3, name: 'Hydration', category: 'Body', icon: '💧', completed: [true, true, true, true, true, true, true] },
    { id: 4, name: 'Exercise', category: 'Body', icon: '💪', completed: [false, true, true, false, true, false, true] },
    { id: 5, name: 'Screen Detox', category: 'Lifestyle', icon: '📵', completed: [true, false, true, true, false, true, true] }
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

      {/* Schedule Grid */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          {/* Week Header */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-sm font-medium text-base-content/70">Habit</div>
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-base-content/70">
                {day}
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          <div className="space-y-3">
            {mockHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-8 gap-2 items-center p-3 rounded-lg hover:bg-base-200/50 transition-colors"
              >
                {/* Habit Info */}
                <div className="flex items-center gap-3">
                  <div className="text-xl">{habit.icon}</div>
                  <div>
                    <div className="font-medium text-base-content">{habit.name}</div>
                    <div className="text-xs text-base-content/60">{habit.category}</div>
                  </div>
                </div>

                {/* Day Toggles */}
                {weekDays.map((day, dayIndex) => (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleHabit(habit.id, dayIndex)}
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                      ${habit.completed[dayIndex]
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-base-300 hover:bg-base-400 text-base-content/60'
                      }
                    `}
                  >
                    {habit.completed[dayIndex] && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Weekly Summary */}
          <div className="mt-6 pt-4 border-t border-base-300">
            <div className="flex items-center justify-between">
              <div className="text-sm text-base-content/70">
                Weekly Completion: 
                <span className="font-bold text-base-content ml-1">
                  {Math.round((mockHabits.reduce((total, habit) => 
                    total + habit.completed.filter(Boolean).length, 0) / 
                    (mockHabits.length * 7)) * 100)}%
                </span>
              </div>
              <div className="flex gap-2">
                {weekDays.map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-base-content/60">{day}</div>
                    <div className="text-sm font-bold text-emerald-500">
                      {mockHabits.filter(habit => habit.completed[index]).length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
