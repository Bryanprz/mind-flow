import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  Calendar,
  Brain,
  Zap,
  Star
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export default function GoalsDashboard({ goalsData }) {
  const [activeGoals, setActiveGoals] = useState([])
  const [completedGoals, setCompletedGoals] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockActiveGoals = [
      {
        id: 1,
        title: "Achieve 90% Focus Score",
        description: "Maintain high focus levels during deep work sessions",
        progress: 82,
        target: 90,
        deadline: "2024-02-15",
        category: "Focus",
        icon: "🧠",
        status: "active",
        daysRemaining: 27,
        color: "cyan"
      },
      {
        id: 2,
        title: "Complete 20 Deep Work Sessions",
        description: "Build consistent deep work habits",
        progress: 8,
        target: 20,
        deadline: "2024-02-28",
        category: "Productivity",
        icon: "⚡",
        status: "active",
        daysRemaining: 40,
        color: "purple"
      },
      {
        id: 3,
        title: "Meditate Daily for 30 Days",
        description: "Establish a consistent meditation practice",
        progress: 15,
        target: 30,
        deadline: "2024-02-10",
        category: "Wellness",
        icon: "🧘",
        status: "active",
        daysRemaining: 22,
        color: "emerald"
      },
      {
        id: 4,
        title: "Read 5 Cognitive Science Books",
        description: "Expand knowledge in cognitive enhancement",
        progress: 2,
        target: 5,
        deadline: "2024-03-31",
        category: "Learning",
        icon: "📚",
        status: "active",
        daysRemaining: 71,
        color: "amber"
      }
    ]

    const mockCompletedGoals = [
      {
        id: 5,
        title: "Establish Morning Routine",
        description: "Create a consistent morning routine",
        progress: 100,
        target: 100,
        completedAt: "2024-01-10",
        category: "Habits",
        icon: "🌅",
        status: "completed"
      },
      {
        id: 6,
        title: "Reduce Screen Time by 30%",
        description: "Limit digital distractions",
        progress: 100,
        target: 100,
        completedAt: "2024-01-05",
        category: "Digital Wellness",
        icon: "📱",
        status: "completed"
      }
    ]

    setActiveGoals(mockActiveGoals)
    setCompletedGoals(mockCompletedGoals)
  }, [])

  const categories = [
    { key: 'all', label: 'All Goals', icon: Target, color: 'cyan' },
    { key: 'Focus', label: 'Focus', icon: Brain, color: 'cyan' },
    { key: 'Productivity', label: 'Productivity', icon: Zap, color: 'purple' },
    { key: 'Wellness', label: 'Wellness', icon: Star, color: 'emerald' },
    { key: 'Learning', label: 'Learning', icon: Award, color: 'amber' }
  ]

  const filteredGoals = selectedCategory === 'all' 
    ? activeGoals 
    : activeGoals.filter(goal => goal.category === selectedCategory)

  const getProgressColor = (progress, target) => {
    const percentage = (progress / target) * 100
    if (percentage >= 100) return 'from-emerald-400 to-emerald-500'
    if (percentage >= 75) return 'from-cyan-400 to-cyan-500'
    if (percentage >= 50) return 'from-blue-400 to-blue-500'
    return 'from-purple-400 to-purple-500'
  }

  const getStatusColor = (goal) => {
    if (goal.status === 'completed') return 'text-emerald-400'
    if (goal.daysRemaining <= 7) return 'text-red-400'
    if (goal.daysRemaining <= 14) return 'text-amber-400'
    return 'text-cyan-400'
  }

  const GoalCard = ({ goal, isCompleted = false }) => {
    const colorClasses = {
      cyan: {
        border: 'border-cyan-400/30',
        title: 'text-cyan-300',
        description: 'text-cyan-300',
        category: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
        calendar: 'text-cyan-300',
        calendarIcon: 'text-cyan-400',
        progress: 'text-cyan-300',
        progressLabel: 'text-cyan-300',
        iconBg: 'from-cyan-500/20 to-blue-500/20',
        editBtn: 'bg-cyan-500/20 hover:bg-cyan-500/30',
        editIcon: 'text-cyan-400 group-hover:text-cyan-300'
      },
      purple: {
        border: 'border-purple-400/30',
        title: 'text-purple-300',
        description: 'text-purple-300',
        category: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
        calendar: 'text-purple-300',
        calendarIcon: 'text-purple-400',
        progress: 'text-purple-300',
        progressLabel: 'text-purple-300',
        iconBg: 'from-purple-500/20 to-pink-500/20',
        editBtn: 'bg-purple-500/20 hover:bg-purple-500/30',
        editIcon: 'text-purple-400 group-hover:text-purple-300'
      },
      emerald: {
        border: 'border-emerald-400/30',
        title: 'text-emerald-300',
        description: 'text-emerald-300',
        category: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        calendar: 'text-emerald-300',
        calendarIcon: 'text-emerald-400',
        progress: 'text-emerald-300',
        progressLabel: 'text-emerald-300',
        iconBg: 'from-emerald-500/20 to-green-500/20',
        editBtn: 'bg-emerald-500/20 hover:bg-emerald-500/30',
        editIcon: 'text-emerald-400 group-hover:text-emerald-300'
      },
      amber: {
        border: 'border-amber-400/30',
        title: 'text-amber-300',
        description: 'text-amber-300',
        category: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        calendar: 'text-amber-300',
        calendarIcon: 'text-amber-400',
        progress: 'text-amber-300',
        progressLabel: 'text-amber-300',
        iconBg: 'from-amber-500/20 to-orange-500/20',
        editBtn: 'bg-amber-500/20 hover:bg-amber-500/30',
        editIcon: 'text-amber-400 group-hover:text-amber-300'
      }
    }
    
    const colors = colorClasses[goal.color] || colorClasses.cyan
    
    return (
      <motion.div
        variants={itemVariants}
        className={`theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border ${colors.border} bg-gradient-to-br from-slate-900/80 to-slate-800/60 ${
          isCompleted ? 'opacity-75' : ''
        } min-h-[280px] flex flex-col`}
        whileHover={{ scale: 1.005 }}
      >
        <div className="flex items-start justify-between mb-4 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-2xl">{goal.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-lg font-semibold ${colors.title} truncate`}>
                  {goal.title}
                </h3>
                {isCompleted ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </span>
                ) : goal.daysRemaining <= 7 ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Due Soon
                  </span>
                ) : null}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.category}`}>
                {goal.category}
              </span>
            </div>
            
            {goal.deadline && (
              <p className={`${colors.calendar} text-sm flex items-center gap-2`}>
                <Calendar className={`w-4 h-4 ${colors.calendarIcon} flex-shrink-0`} />
                <span className="truncate">{isCompleted ? `Completed ${goal.completedAt}` : `${goal.daysRemaining} days remaining`}</span>
              </p>
            )}
          </div>
          
          <div className="flex gap-2 flex-shrink-0 ml-2">
            <button className={`w-8 h-8 ${colors.editBtn} rounded-lg flex items-center justify-center transition-all duration-200 group`}>
              <Edit className={`w-4 h-4 ${colors.editIcon}`} />
            </button>
            <button className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200 group">
              <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
            </button>
          </div>
        </div>

        {goal.description && (
          <p className={`${colors.description} text-sm mb-4 leading-relaxed flex-1`}>{goal.description}</p>
        )}

        <div className="space-y-3 mt-auto">
          <div className="flex justify-between items-center">
            <span className={`${colors.progress} text-sm font-medium`}>Progress</span>
            <span className={`${colors.progress} font-bold text-sm`}>{goal.progress} / {goal.target}</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${getProgressColor(goal.progress, goal.target)} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${colors.progressLabel}`}>Progress</span>
            <span className={`text-sm font-semibold ${getStatusColor(goal)}`}>
              {Math.round((goal.progress / goal.target) * 100)}% Complete
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full h-full bg-transparent relative">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-transparent z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">MISSION OBJECTIVES</h1>
            <p className="text-cyan-400 text-sm">Track your progress and achieve your targets</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewObjectiveModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-cyan-400/20"
        >
          <Plus className="w-5 h-5" />
          New Objective
        </motion.button>
      </div>

      {/* Scrollable Content Container */}
      <div className="w-full h-full flex pt-20 overflow-y-auto" style={{overflow: 'scroll'}}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-full flex flex-col p-6 pb-20 space-y-6"
        >

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const colorClasses = {
              cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-cyan-400/20',
              purple: 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-purple-400/20',
              emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-400/20',
              amber: 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-400/20'
            }
            const inactiveColorClasses = {
              cyan: 'text-cyan-300 hover:bg-cyan-500/10 border-cyan-400/30 hover:border-cyan-400/50',
              purple: 'text-purple-300 hover:bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50',
              emerald: 'text-emerald-300 hover:bg-emerald-500/10 border-emerald-400/30 hover:border-emerald-400/50',
              amber: 'text-amber-300 hover:bg-amber-500/10 border-amber-400/30 hover:border-amber-400/50'
            }
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.key
                    ? `${colorClasses[category.color]} border shadow-lg`
                    : `bg-transparent ${inactiveColorClasses[category.color]}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </motion.div>

        {/* Active Goals */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-cyan-300 tracking-wide">ACTIVE OBJECTIVES</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredGoals.length} in progress</span>
            </div>
          </div>
          
          {filteredGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="theme-glass-card p-8 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">No active objectives</h3>
              <p className="text-cyan-300 mb-6">Start your mission by creating your first objective</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Create Your First Objective
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-emerald-300 tracking-wide">COMPLETED OBJECTIVES</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} isCompleted={true} />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Bottom Padding */}
        <div className="h-20 flex-shrink-0"></div>
        </motion.div>
      </div>

      {/* New Objective Modal */}
      {showNewObjectiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="theme-glass-card p-8 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-cyan-300">New Objective</h3>
              <button
                onClick={() => setShowNewObjectiveModal(false)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200"
              >
                <span className="text-red-400 text-lg">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">Objective Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter your objective..."
                />
              </div>
              
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                  rows="3"
                  placeholder="Describe your objective..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">Target</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                    <option value="Focus">Focus</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                onClick={() => setShowNewObjectiveModal(false)}
                className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewObjectiveModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Create Objective
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
