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
        daysRemaining: 27
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
        daysRemaining: 40
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
        daysRemaining: 22
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
        daysRemaining: 71
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
    { key: 'all', label: 'All Goals', icon: Target },
    { key: 'Focus', label: 'Focus', icon: Brain },
    { key: 'Productivity', label: 'Productivity', icon: Zap },
    { key: 'Wellness', label: 'Wellness', icon: Star },
    { key: 'Learning', label: 'Learning', icon: Award }
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

  const GoalCard = ({ goal, isCompleted = false }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 ${
        isCompleted ? 'opacity-75' : ''
      } min-h-[280px] flex flex-col`}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start justify-between mb-4 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{goal.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
              {goal.category}
            </span>
          </div>
          
          {goal.deadline && (
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{isCompleted ? `Completed ${goal.completedAt}` : `${goal.daysRemaining} days remaining`}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-2 flex-shrink-0 ml-2">
          <button className="w-8 h-8 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg flex items-center justify-center transition-all duration-200 group">
            <Edit className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200 group">
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">{goal.description}</p>
      )}

      <div className="space-y-3 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm font-medium">Progress</span>
          <span className="text-white font-bold text-sm">{goal.progress} / {goal.target}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getProgressColor(goal.progress, goal.target)} h-3 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Progress</span>
          <span className={`text-sm font-semibold ${getStatusColor(goal)}`}>
            {Math.round((goal.progress / goal.target) * 100)}% Complete
          </span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="w-full h-full bg-transparent relative">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col overflow-y-auto p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">MISSION OBJECTIVES</h1>
              <p className="text-cyan-400 text-sm">Track your progress and achieve your targets</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-cyan-400/20"
          >
            <Plus className="w-5 h-5" />
            New Objective
          </motion.button>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-400/20'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white border border-gray-600/30 hover:border-gray-500/50'
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
              <h2 className="text-2xl font-bold text-white">ACTIVE OBJECTIVES</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
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
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No active objectives</h3>
              <p className="text-gray-400 mb-6">Start your mission by creating your first objective</p>
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
              <h2 className="text-2xl font-bold text-white">COMPLETED OBJECTIVES</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} isCompleted={true} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
