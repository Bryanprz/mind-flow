import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Target, Clock, CheckCircle } from 'lucide-react'
import HabitCard from './HabitCard'

// Helper function to clean ActionText content
const cleanActionTextContent = (content) => {
  if (!content) return ''
  
  // Remove ActionText HTML comments and wrapper divs
  return content
    .replace(/<!-- BEGIN app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- END app\/views\/layouts\/action_text\/contents\/_content\.html\.erb -->/g, '')
    .replace(/<!-- BEGIN \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<!-- END \/Users\/[^>]+_content\.html\.erb -->/g, '')
    .replace(/<div class="trix-content">/g, '')
    .replace(/<\/div>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function HabitScheduleBuilder({ 
  planSections = [],
  completions = {},
  onToggleItem,
  className = ''
}) {

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Get all habits from all sections for summary calculations
  const allHabits = planSections.flatMap(section => 
    section.plan_items.map(item => ({
      id: item.id,
      name: cleanActionTextContent(item.content),
      category: section.name,
      completed: new Array(7).fill(false) // Mock weekly data
    }))
  )

  const handleToggleHabit = (habitId) => {
    if (onToggleItem) {
      onToggleItem(habitId)
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

      </div>

      {/* Sectioned Card Layout - Matches Left Column */}
      <div className="space-y-6">
        {planSections.map((section, sectionIndex) => {
          // Convert section items to habit format
          const sectionHabits = section.plan_items.map(item => ({
            id: item.id,
            name: cleanActionTextContent(item.content),
            category: section.name,
            icon: section.name.includes('Mind') ? '🧘‍♂️' : 
                  section.name.includes('Body') ? '💪' : '🎯',
            completed: new Array(7).fill(false), // Mock weekly data
            streak: Math.floor(Math.random() * 7) + 1,
            weeklyGoal: 5
          }))

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-6"
            >

              {/* Section Cards - Horizontal Carousel */}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 py-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                {sectionHabits.map((habit, index) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    index={index}
                    onToggleHabit={(habitId) => onToggleItem && onToggleItem(habitId)}
                    weekDays={weekDays}
                    className="flex-shrink-0 w-80 snap-start"
                  />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>


    </div>
  )
}
