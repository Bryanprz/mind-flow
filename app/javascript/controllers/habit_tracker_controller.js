import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  async toggleItem(event) {
    const checkbox = event.target
    const planItemId = event.params.planItemId
    const habitLogId = event.params.habitLogId
    const completed = checkbox.checked

    if (!habitLogId) {
      alert('Please create a log for this date first')
      checkbox.checked = !completed
      return
    }

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

      // Add visual feedback
      const label = checkbox.closest('.flex').querySelector('.flex-1 div')
      if (completed) {
        label.classList.add('line-through', 'text-gray-500')
      } else {
        label.classList.remove('line-through', 'text-gray-500')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update item. Please try again.')
      checkbox.checked = !completed
    }
  }
}

