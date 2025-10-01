import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  handleKeydown(event) {
    // If Enter is pressed without Shift, submit the form
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.element.requestSubmit()
    }
    // If Shift+Enter is pressed, allow default behavior (line break)
  }
}