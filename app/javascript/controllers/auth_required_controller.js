import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  submit(event) {
    event.preventDefault()
    
    // Show the sign-up modal
    this.showSignUpModal()
  }
  
  handleClick(event) {
    // Prevent default and show modal for submit button clicks and media icon clicks
    if (event.target.type === 'submit' || event.target.closest('button[type="submit"]') || event.target.closest('label[for*="media"]')) {
      event.preventDefault()
      this.showSignUpModal()
    }
    // For other clicks (like input field), allow normal behavior
  }
  
  handleFocus(event) {
    // Allow normal focus behavior - don't show modal
    // User can type in the input field
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.showSignUpModal()
  }
  
  handleEnter(event) {
    // Only show modal if Enter is pressed in a form context
    if (event.key === 'Enter') {
      event.preventDefault()
      this.showSignUpModal()
    }
  }
  
  showSignUpModal() {
    // Use the existing sign-up modal
    const existingModal = document.getElementById('sign_up_modal')
    if (existingModal) {
      existingModal.showModal()
    }
  }
}
