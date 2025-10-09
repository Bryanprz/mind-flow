import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Save, Clock, Smile, Heart, Meh, Frown, TrendingUp } from 'lucide-react'

export default function JournalEditor({ 
  habitLogId, 
  initialEntry = '', 
  initialMood = null,
  onSave,
  className = ''
}) {
  const [entry, setEntry] = useState(initialEntry)
  const [mood, setMood] = useState(initialMood)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [charCount, setCharCount] = useState(initialEntry.length)
  const textareaRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  const moods = [
    { id: 'excellent', emoji: '😄', icon: Smile, color: 'text-green-500', bg: 'bg-green-100' },
    { id: 'good', emoji: '😊', icon: Heart, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'okay', emoji: '😐', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 'poor', emoji: '😔', icon: Frown, color: 'text-red-500', bg: 'bg-red-100' }
  ]

  // Auto-save functionality
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (entry !== initialEntry) {
      saveTimeoutRef.current = setTimeout(() => {
        handleSave()
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [entry])

  // Update character count
  useEffect(() => {
    setCharCount(entry.length)
  }, [entry])

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      const response = await fetch('/habit_plans/save_journal_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          habit_log_id: habitLogId,
          journal_entry: entry,
          mood: mood
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      setLastSaved(new Date())
      if (onSave) onSave(entry, mood)
    } catch (error) {
      console.error('Error saving journal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEntryChange = (e) => {
    setEntry(e.target.value)
  }

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood)
    // Auto-save when mood changes
    setTimeout(() => handleSave(), 500)
  }

  const getWordCount = () => {
    return entry.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getProgressColor = () => {
    const percentage = (charCount / 500) * 100
    if (percentage >= 100) return 'from-red-400 to-red-600'
    if (percentage >= 75) return 'from-yellow-400 to-orange-500'
    if (percentage >= 50) return 'from-blue-400 to-blue-600'
    return 'from-green-400 to-green-600'
  }

  return (
    <motion.div
      className={`card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          
          <div>
            <h2 className="text-xl font-bold text-base-content">Daily Journal</h2>
            <p className="text-sm text-base-content/70">Reflect on your day and track your progress</p>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-base-content mb-3">How are you feeling today?</h3>
          <div className="flex gap-3">
            {moods.map((moodOption) => {
              const Icon = moodOption.icon
              const isSelected = mood === moodOption.id
              
              return (
                <motion.button
                  key={moodOption.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(moodOption.id)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300
                    ${isSelected 
                      ? `border-primary ${moodOption.bg}` 
                      : 'border-base-300 hover:border-primary/50 bg-base-200/50'
                    }
                  `}
                >
                  <motion.div
                    animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    {moodOption.emoji}
                  </motion.div>
                  <span className={`text-xs font-medium capitalize ${isSelected ? moodOption.color : 'text-base-content/70'}`}>
                    {moodOption.id}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Journal Entry */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-base-content">Journal Entry</h3>
            <div className="flex items-center gap-4 text-xs text-base-content/70">
              <span>{getWordCount()} words</span>
              <span>{charCount}/500 characters</span>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={entry}
              onChange={handleEntryChange}
              placeholder="How was your day? Any insights, challenges, or wins to record?"
              className="textarea textarea-bordered w-full h-32 resize-none focus:textarea-primary"
              maxLength={500}
            />
            
            {/* Character count progress bar */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="h-1 bg-base-300 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((charCount / 500) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-blue-500"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Save className="w-4 h-4" />
                  </motion.div>
                  <span>Saving...</span>
                </motion.div>
              ) : lastSaved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <Save className="w-4 h-4" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-base-content/50"
                >
                  <Clock className="w-4 h-4" />
                  <span>Auto-save enabled</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            <Save className="w-4 h-4" />
            Save Now
          </motion.button>
        </div>

        {/* Writing Tips */}
        {charCount < 50 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-base-200/50 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm text-base-content/70">
                <strong>Writing tip:</strong> Try to write at least 50 characters to capture meaningful reflections about your day.
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
