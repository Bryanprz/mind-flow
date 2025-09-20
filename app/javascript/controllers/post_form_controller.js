import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["formContainer", "form"]

  connect() {
    // Auto-focus the content field when form is shown
    this.formTargets[0]?.querySelector('textarea')?.focus()
  }

  toggle() {
    this.formContainerTarget.classList.toggle("hidden")
    if (!this.formContainerTarget.classList.contains("hidden")) {
      this.formTargets[0]?.querySelector('textarea')?.focus()
    }
  }

  handleSubmit(event) {
    if (event.detail.success) {
      // Hide the form after successful submission
      this.formContainerTarget.classList.add("hidden")
      // Reset the form
      this.formTargets[0]?.reset()
    }
  }

  submit(event) {
    // Prevent default form submission
    event.preventDefault()
    // Submit the form via Turbo
    this.formTargets[0]?.requestSubmit()
  }
}
