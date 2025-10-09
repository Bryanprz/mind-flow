import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Edit3, Trash2, Calendar, TrendingUp, Award } from 'lucide-react'

export default function GoalTracker({ 
  className = ''
}) {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete 30-day meditation streak",
      description: "Build consistent mindfulness practice",
      category: "Mind",
      targetDate: "2025-01-31",
      progress: 75,
      status: "in_progress",
      milestones: [
        { id: 1, title: "Week 1: Establish routine", completed: true },
        { id: 2, title: "Week 2: Increase duration", completed: true },
        { id: 3, title: "Week 3: Add advanced techniques", completed: false },
        { id: 4, title: "Week 4: Master consistency", completed: false }
      ]
    },
    {
      id: 2,
      title: "Read 12 books this year",
      description: "Expand knowledge across multiple domains",
      category: "Learning",
      targetDate: "2025-12-31",
      progress: 25,
      status: "on_track",
      milestones: [
        { id: 1, title: "Q1: 3 books", completed: true },
        { id: 2, title: "Q2: 3 books", completed: false },
        { id: 3, title: "Q3: 3 books", completed: false },
        { id: 4, title: "Q4: 3 books", completed: false }
      ]
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Mind',
    targetDate: '',
    milestones: []
  })

  const categories = [
    { id: 'Mind', label: 'Mind', icon: '🧠', color: 'from-blue-500 to-purple-500' },
    { id: 'Body', label: 'Body', icon: '💪', color: 'from-green-500 to-emerald-500' },
    { id: 'Learning', label: 'Learning', icon: '📚', color: 'from-orange-500 to-red-500' },
    { id: 'Career', label: 'Career', icon: '🚀', color: 'from-purple-500 to-pink-500' },
    { id: 'Relationships', label: 'Relationships', icon: '❤️', color: 'from-pink-500 to-rose-500' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50 border-green-200'
      case 'on_track': return 'text-blue-500 bg-blue-50 border-blue-200'
      case 'at_risk': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'behind': return 'text-red-500 bg-red-50 border-red-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '🎉'
      case 'on_track': return '📈'
      case 'at_risk': return '⚠️'
      case 'behind': return '🚨'
      default: return '🎯'
    }
  }

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        status: 'in_progress',
        milestones: newGoal.milestones.filter(m => m.title.trim())
      }
      setGoals([...goals, goal])
      setNewGoal({ title: '', description: '', category: 'Mind', targetDate: '', milestones: [] })
      setShowAddModal(false)
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setNewGoal(goal)
    setShowEditModal(true)
  }

  const handleUpdateGoal = () => {
    if (editingGoal && newGoal.title.trim()) {
      setGoals(goals.map(g => g.id === editingGoal.id ? { ...g, ...newGoal } : g))
      setShowEditModal(false)
      setEditingGoal(null)
      setNewGoal({ title: '', description: '', category: 'Mind', targetDate: '', milestones: [] })
    }
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId))
  }

  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, { id: Date.now(), title: '', completed: false }]
    })
  }

  const updateMilestone = (milestoneId, updates) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.map(m => 
        m.id === milestoneId ? { ...m, ...updates } : m
      )
    })
  }

  const removeMilestone = (milestoneId) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter(m => m.id !== milestoneId)
    })
  }

  const daysUntilTarget = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Goal Tracker</h3>
            <p className="text-sm text-base-content/70">Quarterly & long-term milestones</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </motion.button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="card-body p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {categories.find(c => c.id === goal.category)?.icon || '🎯'}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-base-content">{goal.title}</h4>
                        <p className="text-sm text-base-content/70">{goal.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className={`badge ${getStatusColor(goal.status)}`}>
                        {getStatusIcon(goal.status)} {goal.status.replace('_', ' ')}
                      </div>
                      <div className="text-base-content/60">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {daysUntilTarget(goal.targetDate)} days left
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditGoal(goal)}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn btn-ghost btn-sm btn-circle text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-base-content">Progress</span>
                    <span className="text-sm font-bold text-base-content">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-base-content/80 mb-2">Milestones</h5>
                  {goal.milestones.map((milestone, mIndex) => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      <motion.div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-base-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {milestone.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Award className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      <span className={`text-sm ${milestone.completed ? 'line-through text-base-content/60' : 'text-base-content'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Goal Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowAddModal(false)
              setShowEditModal(false)
              setEditingGoal(null)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card bg-base-100 shadow-2xl max-w-2xl mx-4 w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-6">
                <h3 className="text-lg font-bold mb-4">
                  {showEditModal ? 'Edit Goal' : 'Add New Goal'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Goal Title</span>
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Complete 30-day meditation streak"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal and why it matters..."
                      className="textarea textarea-bordered w-full h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                        className="select select-bordered w-full"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Target Date</span>
                      </label>
                      <input
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="label">
                        <span className="label-text">Milestones</span>
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addMilestone}
                        className="btn btn-sm btn-ghost"
                      >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                      </motion.button>
                    </div>
                    
                    <div className="space-y-2">
                      {newGoal.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                            placeholder={`Milestone ${index + 1}`}
                            className="input input-bordered flex-1 input-sm"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeMilestone(milestone.id)}
                            className="btn btn-ghost btn-sm btn-circle text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setEditingGoal(null)
                    }}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={showEditModal ? handleUpdateGoal : handleAddGoal}
                    className="btn btn-primary flex-1"
                  >
                    {showEditModal ? 'Update Goal' : 'Add Goal'}
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

