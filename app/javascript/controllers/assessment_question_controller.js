import { Controller } from "@hotwired/stimulus"

// Handles the assessment question submission with a delay for visual feedback.
export default class extends Controller {
  // Delays form submission to allow the user to see the selected state.
  select() {
    setTimeout(() => {
      this.element.requestSubmit()
    }, 300) // 300ms delay
  }
}
