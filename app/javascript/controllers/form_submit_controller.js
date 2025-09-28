import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.submitting = false
  }

  handleClick(event) {
    console.log("Submit button clicked!")
    console.log("Form element:", this.element)
    console.log("Form action:", this.element.action)
    console.log("Form method:", this.element.method)
    
    // Prevent double submission
    if (this.submitting) {
      console.log("Form already submitting, preventing double submission")
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    
    // Check if form is valid
    const isValid = this.element.checkValidity()
    console.log("Form is valid:", isValid)
    
    if (!isValid) {
      console.log("Form validation failed!")
      this.element.reportValidity()
      return false
    }
    
    // Set submitting flag
    this.submitting = true
    
    // Disable the submit button to prevent multiple clicks
    const submitButton = event.target
    if (submitButton) {
      submitButton.disabled = true
      submitButton.classList.add('opacity-50', 'cursor-not-allowed')
    }
    
    // Reset flag after a delay to allow for form submission
    setTimeout(() => {
      this.submitting = false
      if (submitButton) {
        submitButton.disabled = false
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed')
      }
    }, 3000)
    
    // Let the form submit normally
    return true
  }
}
