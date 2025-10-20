import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Activity,
  Clock,
  Award,
  BrainCircuit
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function AnalyticsDashboard({ analyticsData }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking for futuristic effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Mock data for demonstration
  const performanceData = [
    { day: 'Mon', focus: 8.2, clarity: 7.8, energy: 8.5, flow: 2.1 },
    { day: 'Tue', focus: 8.5, clarity: 8.1, energy: 8.2, flow: 1.8 },
    { day: 'Wed', focus: 7.9, clarity: 7.6, energy: 7.8, flow: 1.2 },
    { day: 'Thu', focus: 8.8, clarity: 8.4, energy: 9.1, flow: 3.2 },
    { day: 'Fri', focus: 8.1, clarity: 7.9, energy: 8.3, flow: 2.5 },
    { day: 'Sat', focus: 8.6, clarity: 8.2, energy: 8.7, flow: 2.8 },
    { day: 'Sun', focus: 8.3, clarity: 8.0, energy: 8.4, flow: 2.2 }
  ]

  const sessionData = [
    { type: 'Deep Work', hours: 12, color: '#3b82f6' },
    { type: 'Meditation', hours: 8, color: '#8b5cf6' },
    { type: 'Learning', hours: 6, color: '#10b981' },
    { type: 'Flow State', hours: 4, color: '#f59e0b' }
  ]

  const metrics = [
    {
      title: 'Average Focus',
      value: '8.3',
      unit: '/10',
      change: '+12%',
      changeType: 'positive',
      icon: Brain,
      color: 'cyan'
    },
    {
      title: 'Flow State Hours',
      value: '3.2',
      unit: 'hrs',
      change: '+8%',
      changeType: 'positive',
      icon: Zap,
      color: 'purple'
    },
    {
      title: 'Deep Work Sessions',
      value: '8',
      unit: '',
      change: '+2',
      changeType: 'positive',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Consistency Score',
      value: '94',
      unit: '%',
      change: '+5%',
      changeType: 'positive',
      icon: Award,
      color: 'amber'
    }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-xl shadow-2xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold text-lg">{label}</p>
            <div className="flex items-center gap-1 text-xs text-cyan-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-300 capitalize">{entry.dataKey}</span>
                </div>
                <span className="text-white font-bold text-lg">{entry.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full bg-transparent relative">
      {/* Mouse tracking indicator */}
      <div 
        className="fixed pointer-events-none z-50 transition-all duration-100"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      >
        <div className="w-5 h-5 bg-cyan-400/30 rounded-full border border-cyan-400/60 shadow-lg shadow-cyan-400/20"></div>
      </div>

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
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">COGNITIVE ANALYTICS</h1>
              <p className="text-cyan-400 text-sm">Advanced performance insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {['7d', '30d', '90d'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTimeframe === timeframe
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isLiveMode 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLiveMode ? 'animate-spin' : ''}`} />
              {isLiveMode ? 'Live' : 'Paused'}
            </button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div 
                key={index}
                className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                  </div>
                  <span className={`text-xs text-${metric.color}-400 font-medium`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {metric.value}
                  <span className="text-lg text-gray-400 ml-1">{metric.unit}</span>
                </div>
                <div className="text-sm text-gray-400">{metric.title}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <motion.div variants={itemVariants} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">PERFORMANCE TRENDS</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity className="w-4 h-4" />
                <span>7-day overview</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="clarityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="focus" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="clarity" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="8 4" dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={3} strokeDasharray="4 8" dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Session Breakdown */}
          <motion.div variants={itemVariants} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">SESSION BREAKDOWN</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>This week</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000000',
                      border: '1px solid #8b5cf6',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Weekly Summary */}
        <motion.div variants={itemVariants} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">WEEKLY INSIGHTS</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Updated 2 minutes ago</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">Peak Performance</h4>
              <p className="text-cyan-400 text-sm">Thursday was your best day with 91% focus score</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">Flow State</h4>
              <p className="text-purple-400 text-sm">3.2 hours in deep flow this week</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">Consistency</h4>
              <p className="text-emerald-400 text-sm">94% consistency score - excellent!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
