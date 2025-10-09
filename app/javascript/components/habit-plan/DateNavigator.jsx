import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

export default function DateNavigator({ 
  currentDate, 
  onDateChange, 
  completedDates = [],
  className = ''
}) {
  const [showCalendar, setShowCalendar] = useState(false)
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    onDateChange(newDate.toISOString().split('T')[0])
  }

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0]
    onDateChange(today)
  }

  const isToday = (date) => {
    const today = new Date().toISOString().split('T')[0]
    return date === today
  }

  const isCompleted = (date) => {
    return completedDates.includes(date)
  }

  const isCurrentDate = (date) => {
    return date === currentDate
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const date = new Date(currentDate)
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day.toISOString().split('T')[0])
    }
    
    return days
  }

  return (
    <div className={`relative ${className}`}>
      {/* Date Navigation Card */}
      <motion.div
        className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            {/* Navigation buttons */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateDate(-1)}
                className="btn btn-circle btn-sm btn-ghost"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {/* Current date display */}
              <motion.div 
                className="text-center cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-lg font-semibold text-base-content">
                  {formatDate(currentDate)}
                </div>
                <div className="flex items-center gap-1 text-sm text-base-content/70">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isToday(currentDate) ? "Today" : 
                     new Date(currentDate) < new Date() ? "Past" : "Future"}
                  </span>
                </div>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateDate(1)}
                className="btn btn-circle btn-sm btn-ghost"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Today button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className={`btn btn-sm ${
                isToday(currentDate) 
                  ? 'btn-primary' 
                  : 'btn-ghost'
              }`}
            >
              Today
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Calendar Popover */}
      <AnimatePresence>
        {showCalendar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowCalendar(false)}
            />
            
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <div className="card bg-base-100 shadow-2xl border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base-content flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Select Date
                    </h3>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="btn btn-sm btn-ghost btn-circle"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-xs font-medium text-base-content/70 p-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {generateCalendarDays().map((date, index) => {
                      const isCurrent = isCurrentDate(date)
                      const completed = isCompleted(date)
                      const today = isToday(date)
                      
                      return (
                        <motion.button
                          key={date}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.01 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            onDateChange(date)
                            setShowCalendar(false)
                          }}
                          className={`
                            aspect-square text-xs rounded-lg transition-all duration-200
                            ${isCurrent 
                              ? 'bg-primary text-primary-content font-bold' 
                              : completed 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : today 
                                  ? 'bg-base-300 text-base-content font-semibold hover:bg-base-400' 
                                  : 'hover:bg-base-200 text-base-content'
                            }
                          `}
                        >
                          {new Date(date).getDate()}
                        </motion.button>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-base-300">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-base-300 rounded"></div>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
