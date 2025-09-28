import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "form"]

  connect() {
    // Message form controller connected
  }

  handleKeydown(event) {
    // If Enter is pressed without Shift
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Prevent default line break
      this.submitForm()
    }
    // If Shift+Enter is pressed, allow default behavior (line break)
  }

  submitForm() {
    // Check if there's any content
    const content = this.contentTarget.value.trim()
    if (content === '' || content === '<div><br></div>' || content === '<p><br></p>') {
      return
    }
    
    // Submit the form
    this.formTarget.requestSubmit()
  }
}
