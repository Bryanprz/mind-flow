import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["collapsed", "expanded", "form"]

  expand() {
    this.collapsedTarget.classList.add("hidden")
    this.expandedTarget.classList.remove("hidden")
    this.expandedTarget.querySelector('trix-editor')?.focus()
  }

  handleSubmit(event) {
    if (event.detail.success) {
      // Hide the form after successful submission
      this.expandedTarget.classList.add("hidden")
      this.collapsedTarget.classList.remove("hidden")
      // Reset the form
      this.formTarget?.reset()
    }
  }

  submit(event) {
    // Prevent default form submission
    event.preventDefault()
    // Submit the form via Turbo
    this.formTarget?.requestSubmit()
  }
}