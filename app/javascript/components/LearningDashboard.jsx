import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Award, 
  Flame,
  Play,
  Eye,
  Star,
  TrendingUp,
  Brain,
  Zap,
  Target,
  ChevronRight,
  CheckCircle,
  Circle
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

export default function LearningDashboard({ learningData }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [learningProgress, setLearningProgress] = useState({})
  const [currentStreak, setCurrentStreak] = useState(15)

  // Mock data for demonstration
  const progressStats = [
    {
      title: "Courses Completed",
      value: 3,
      icon: GraduationCap,
      color: "cyan",
      change: "+1 this week"
    },
    {
      title: "Books Read",
      value: 12,
      icon: BookOpen,
      color: "purple",
      change: "+2 this month"
    },
    {
      title: "Hours Studied",
      value: 48,
      icon: Clock,
      color: "emerald",
      change: "+8 this week"
    },
    {
      title: "Certificates",
      value: 2,
      icon: Award,
      color: "amber",
      change: "+1 recently"
    },
    {
      title: "Current Streak",
      value: currentStreak,
      icon: Flame,
      color: "red",
      change: "Keep it up!"
    }
  ]

  const courses = [
    {
      id: 1,
      title: "Advanced Focus Techniques",
      instructor: "Dr. Sarah Chen",
      progress: 75,
      rating: 4.8,
      duration: "8 hours",
      difficulty: "Intermediate",
      category: "Focus"
    },
    {
      id: 2,
      title: "Flow State Mastery",
      instructor: "Prof. Mike Rodriguez",
      progress: 45,
      rating: 4.9,
      duration: "12 hours",
      difficulty: "Advanced",
      category: "Flow"
    },
    {
      id: 3,
      title: "Cognitive Enhancement",
      instructor: "Dr. Emma Wilson",
      progress: 20,
      rating: 4.7,
      duration: "6 hours",
      difficulty: "Beginner",
      category: "Cognitive"
    }
  ]

  const resources = [
    {
      id: 1,
      title: "The Focused Mind: A Complete Guide",
      type: "Book",
      difficulty: "Intermediate",
      category: "Focus"
    },
    {
      id: 2,
      title: "Meditation for Peak Performance",
      type: "Course",
      difficulty: "Beginner",
      category: "Meditation"
    },
    {
      id: 3,
      title: "Flow State Research Papers",
      type: "Research",
      difficulty: "Advanced",
      category: "Research"
    }
  ]

  const learningPath = [
    {
      level: 1,
      title: "Foundation Level",
      description: "Basic cognitive principles",
      status: "completed",
      icon: CheckCircle
    },
    {
      level: 2,
      title: "Intermediate Level",
      description: "Advanced focus techniques",
      status: "current",
      icon: Circle
    },
    {
      level: 3,
      title: "Advanced Level",
      description: "Flow state mastery",
      status: "locked",
      icon: Circle
    },
    {
      level: 4,
      title: "Expert Level",
      description: "Cognitive optimization",
      status: "locked",
      icon: Circle
    }
  ]

  const categories = [
    { key: 'all', label: 'All Content', icon: BookOpen },
    { key: 'Focus', label: 'Focus', icon: Target },
    { key: 'Flow', label: 'Flow', icon: Zap },
    { key: 'Cognitive', label: 'Cognitive', icon: Brain },
    { key: 'Meditation', label: 'Meditation', icon: Star }
  ]

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-emerald-400 to-emerald-500'
    if (progress >= 60) return 'from-cyan-400 to-cyan-500'
    if (progress >= 40) return 'from-blue-400 to-blue-500'
    return 'from-purple-400 to-purple-500'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-500/20'
      case 'Intermediate': return 'text-cyan-400 bg-cyan-500/20'
      case 'Advanced': return 'text-purple-400 bg-purple-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getLevelStatus = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 text-white'
      case 'current': return 'bg-cyan-500 text-white'
      case 'locked': return 'bg-gray-600 text-gray-400'
      default: return 'bg-gray-600 text-gray-400'
    }
  }

  const StatCard = ({ stat }) => {
    const Icon = stat.icon
    const colorClasses = {
      cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300',
      purple: 'from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300',
      emerald: 'from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300',
      amber: 'from-amber-500/20 to-orange-500/20 border-amber-400/30 text-amber-300',
      red: 'from-red-500/20 to-pink-500/20 border-red-400/30 text-red-300'
    }
    return (
      <motion.div
        variants={itemVariants}
        className={`theme-glass-card p-4 hover:theme-neon-glow transition-all duration-300 rounded-xl border ${colorClasses[stat.color].split(' ')[2]} bg-gradient-to-br from-slate-900/80 to-slate-800/60 h-32 flex flex-col justify-between`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div className={`w-8 h-8 bg-gradient-to-br ${colorClasses[stat.color].split(' ')[0]} ${colorClasses[stat.color].split(' ')[1]} rounded-lg flex items-center justify-center border ${colorClasses[stat.color].split(' ')[2]}`}>
            <Icon className={`w-4 h-4 ${colorClasses[stat.color].split(' ')[3]}`} />
          </div>
          <span className="text-md text-emerald-400 font-medium">{stat.change}</span>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${colorClasses[stat.color].split(' ')[3]} mb-1`}>{stat.value}</div>
          <div className={`text-md ${colorClasses[stat.color].split(' ')[3]} font-medium tracking-wide uppercase`}>{stat.title}</div>
        </div>
      </motion.div>
    )
  }

  const CourseCard = ({ course }) => (
    <motion.div
      variants={itemVariants}
      className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60"
      whileHover={{ scale: 1.01 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">{course.title}</h3>
        <p className="text-cyan-400 text-sm mb-2">by {course.instructor}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="text-cyan-300 text-sm">{course.rating}</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-cyan-300 text-sm">{course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
            {course.category}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-cyan-300">Progress</span>
          <span className="text-sm font-semibold text-cyan-300">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${getProgressColor(course.progress)} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 theme-glass-card-sm text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:theme-neon-glow">
          <Play className="w-4 h-4" />
          Continue
        </button>
        <button className="theme-glass-card-sm text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:theme-neon-glow">
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </motion.div>
  )

  const ResourceCard = ({ resource }) => (
    <motion.div
      variants={itemVariants}
      className="theme-glass-card p-4 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-purple-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-purple-300 font-semibold mb-1">{resource.title}</h3>
          <p className="text-purple-400 text-sm">{resource.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <button className="text-purple-300 hover:text-purple-200 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button className="w-full theme-glass-card-sm text-purple-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors hover:theme-neon-glow">
        Start Learning
      </button>
    </motion.div>
  )

  return (
    <div className="w-full h-full bg-transparent relative">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-transparent z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">KNOWLEDGE ACQUISITION</h1>
            <p className="text-cyan-400 text-sm">Expand your cognitive capabilities</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="theme-glass-card-sm px-4 py-2 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
            <span className="text-cyan-300 text-sm font-medium">Learning Streak: {currentStreak} days</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="w-full h-full flex pt-20 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            opacity: 1,
            overflow: 'scroll'
          }}
          className="w-full h-full flex flex-col p-6 space-y-6"
        >

        {/* Progress Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {progressStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.key
                    ? 'theme-glass-card-sm text-cyan-300 border border-cyan-400/30'
                    : 'theme-glass-card-sm text-cyan-400 hover:theme-neon-glow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </motion.div>

        {/* Current Courses */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-300">CURRENT COURSES</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </motion.div>

        {/* Learning Resources & Path */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommended Resources */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-300">RECOMMENDED RESOURCES</h2>
            </div>
            <div className="space-y-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </motion.div>

          {/* Learning Path */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-emerald-300">LEARNING PATH</h2>
            </div>
            <div className="theme-glass-card p-6 hover:theme-neon-glow transition-all duration-300 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-slate-900/80 to-slate-800/60">
              <div className="space-y-4">
                {learningPath.map((level, index) => {
                  const Icon = level.icon
                  return (
                    <div key={level.level} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getLevelStatus(level.status)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-emerald-300 font-semibold">{level.title}</p>
                        <p className="text-emerald-400 text-sm">{level.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <button className="w-full mt-6 theme-glass-card-sm text-emerald-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:theme-neon-glow">
                Continue Learning Path
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </div>
  )
}
