import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "textarea", "status", "saveButton"]

  async save(event) {
    event.preventDefault()
    
    // Update button state
    const originalText = this.saveButtonTarget.textContent
    this.saveButtonTarget.textContent = 'Saving...'
    this.saveButtonTarget.disabled = true

    // Simulate save
    setTimeout(() => {
      // Update status
      if (this.hasStatusTarget) {
        this.statusTarget.textContent = 'Saved just now'
      }

      // Show success feedback
      this.saveButtonTarget.textContent = '✓ Saved'
      setTimeout(() => {
        this.saveButtonTarget.textContent = originalText
      }, 2000)
      
      this.saveButtonTarget.disabled = false
    }, 1000)
  }

  get formElement() {
    return this.hasFormTarget ? this.formTarget : this.element
  }
}

