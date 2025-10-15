import React from 'react'
import { motion } from 'framer-motion'
import GaugeChart from 'react-gauge-chart'
import { Brain, Target, Zap } from 'lucide-react'

export default function WellnessGauge({ currentUser }) {
  const focusScore = 0.82 // 82% - Focus/Mental Clarity score
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-sm rounded-lg p-4 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-base-content">Focus Score</h2>
      </div>
      
      {/* Gauge Section */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <GaugeChart
          id="focus-gauge"
          nrOfLevels={20}
          colors={["#EF4444", "#F59E0B", "#3B82F6"]}
          arcWidth={0.3}
          percent={focusScore}
          textColor="#ffffff"
          needleColor="#3B82F6"
          needleBaseColor="#3B82F6"
          formatTextValue={(value) => `${value}%`}
          style={{ width: '100%', maxWidth: '280px', height: '140px' }}
        />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-2 bg-base-200 rounded-md"
        >
          <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-base-content leading-tight">Concentration</div>
          <div className="text-xs text-base-content/60">Excellent</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-2 bg-base-200 rounded-md"
        >
          <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-base-content leading-tight">Clarity</div>
          <div className="text-xs text-base-content/60">High</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-2 bg-base-200 rounded-md"
        >
          <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-base-content leading-tight">Mental Energy</div>
          <div className="text-xs text-base-content/60">Strong</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

