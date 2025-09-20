import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reset-form"
export default class extends Controller {
  // Reset the form after successful submission
  reset() {
    if (this.element.requestSubmit) {
      this.element.reset()
    }
  }

  // Handle Enter key to submit form
  submitOnEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.element.requestSubmit()
    }
  }
}
