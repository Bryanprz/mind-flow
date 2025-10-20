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
    return (
      <motion.div
        variants={itemVariants}
        className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10"
        whileHover={{ scale: 1.02 }}
      >
        <div className="text-center">
          <div className={`w-16 h-16 bg-${stat.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-3`}>
            <Icon className={`w-8 h-8 text-${stat.color}-400`} />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">{stat.title}</h3>
          <p className={`text-3xl font-bold text-${stat.color}-300 mb-1`}>{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.change}</p>
        </div>
      </motion.div>
    )
  }

  const CourseCard = ({ course }) => (
    <motion.div
      variants={itemVariants}
      className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10"
      whileHover={{ scale: 1.01 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-2">by {course.instructor}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">{course.rating}</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-400 text-sm">{course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
            {course.category}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-semibold text-white">{course.progress}%</span>
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
        <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Play className="w-4 h-4" />
          Continue
        </button>
        <button className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </motion.div>
  )

  const ResourceCard = ({ resource }) => (
    <motion.div
      variants={itemVariants}
      className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{resource.title}</h3>
          <p className="text-gray-400 text-sm">{resource.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
        Start Learning
      </button>
    </motion.div>
  )

  return (
    <div className="w-full h-full bg-transparent relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col overflow-hidden p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">KNOWLEDGE ACQUISITION</h1>
              <p className="text-cyan-400 text-sm">Expand your cognitive capabilities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/30">
              <span className="text-white text-sm">Learning Streak: {currentStreak} days</span>
            </div>
          </div>
        </motion.div>

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
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
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
            <h2 className="text-2xl font-bold text-white">CURRENT COURSES</h2>
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
              <h2 className="text-2xl font-bold text-white">RECOMMENDED RESOURCES</h2>
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
              <h2 className="text-2xl font-bold text-white">LEARNING PATH</h2>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
              <div className="space-y-4">
                {learningPath.map((level, index) => {
                  const Icon = level.icon
                  return (
                    <div key={level.level} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getLevelStatus(level.status)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{level.title}</p>
                        <p className="text-gray-400 text-sm">{level.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <button className="w-full mt-6 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                Continue Learning Path
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
