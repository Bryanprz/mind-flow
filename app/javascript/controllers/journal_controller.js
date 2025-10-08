import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "textarea", "status", "saveButton"]

  async save(event) {
    event.preventDefault()
    
    const formData = new FormData(this.formElement)
    const habitLogId = formData.get('habit_log_id')
    const journalEntry = formData.get('journal_entry')

    // Update button state
    const originalText = this.saveButtonTarget.textContent
    this.saveButtonTarget.textContent = 'Saving...'
    this.saveButtonTarget.disabled = true

    try {
      const response = await fetch('/habit_plans/save_journal_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          habit_log_id: habitLogId,
          journal_entry: journalEntry
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      const data = await response.json()
      
      // Update status
      if (this.hasStatusTarget) {
        this.statusTarget.textContent = 'Saved just now'
      }

      // Show success feedback
      this.saveButtonTarget.textContent = '✓ Saved'
      setTimeout(() => {
        this.saveButtonTarget.textContent = originalText
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save journal entry. Please try again.')
    } finally {
      this.saveButtonTarget.disabled = false
    }
  }

  get formElement() {
    return this.hasFormTarget ? this.formTarget : this.element
  }
}

