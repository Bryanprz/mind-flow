import { useState, useCallback } from 'react'

export const useHabitCompletion = (initialLogId, initialCompletions = {}) => {
  const [habitLogId, setHabitLogId] = useState(initialLogId)
  const [completions, setCompletions] = useState(initialCompletions)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCompletion = useCallback(async (planItemId, completed) => {
    if (!habitLogId) {
      alert('Please create a log for this date first')
      return false
    }

    // Optimistic update
    setCompletions(prev => ({
      ...prev,
      [planItemId]: completed
    }))

    setIsUpdating(true)

    try {
      const response = await fetch('/habit_plans/log_item_progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          plan_item_id: planItemId,
          habit_log_id: habitLogId,
          completed: completed
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      return true
    } catch (error) {
      console.error('Error:', error)
      // Revert optimistic update
      setCompletions(prev => ({
        ...prev,
        [planItemId]: !completed
      }))
      alert('Failed to update item. Please try again.')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [habitLogId])

  const isCompleted = useCallback((planItemId) => {
    return completions[planItemId] || false
  }, [completions])

  const getCompletionCount = useCallback(() => {
    return Object.values(completions).filter(Boolean).length
  }, [completions])

  const getTotalCount = useCallback(() => {
    return Object.keys(completions).length
  }, [completions])

  const getCompletionPercentage = useCallback(() => {
    const total = getTotalCount()
    if (total === 0) return 0
    return Math.round((getCompletionCount() / total) * 100)
  }, [getCompletionCount, getTotalCount])

  return {
    habitLogId,
    setHabitLogId,
    completions,
    setCompletions,
    isUpdating,
    toggleCompletion,
    isCompleted,
    getCompletionCount,
    getTotalCount,
    getCompletionPercentage
  }
}
