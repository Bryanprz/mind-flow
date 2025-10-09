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
      className="card bg-base-100 shadow-sm rounded-lg p-6 h-full"
    >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-base-content">
          <Brain className="w-5 h-5 text-blue-600" />
          Focus Score
        </h2>
        
        <div className="flex-1 flex flex-col items-center justify-center">
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
            style={{ width: '100%', maxWidth: '300px' }}
          />
          
          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-base-100 rounded-lg"
            >
              <Brain className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-base-content">Concentration</div>
              <div className="text-xs text-base-content/70">Excellent</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-base-100 rounded-lg"
            >
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-base-content">Clarity</div>
              <div className="text-xs text-base-content/70">High</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 bg-base-100 rounded-lg"
            >
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-base-content">Mental Energy</div>
              <div className="text-xs text-base-content/70">Strong</div>
            </motion.div>
          </div>
        </div>
    </motion.div>
  )
}

