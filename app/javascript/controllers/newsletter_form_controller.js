import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "email", "submit", "message"]
  
  connect() {
    this.resetForm()
  }
  
  submit(event) {
    const email = this.emailTarget.value.trim()
    if (!email) {
      event.preventDefault()
      this.showError("Please enter your email address")
      return
    }
    
    if (!this.isValidEmail(email)) {
      event.preventDefault()
      this.showError("Please enter a valid email address")
      return
    }
    
    this.disableSubmit()
    this.clearMessage()
    
    // Let the form submit naturally via Turbo
  }
  
  success() {
    this.resetForm()
    this.showSuccess("Successfully subscribed! Check your email for a welcome message.")
  }
  
  error(event) {
    this.enableSubmit()
    
    if (event.detail && event.detail.errors) {
      const errorMessages = Object.values(event.detail.errors).flat()
      this.showError(errorMessages.join(", "))
    } else {
      this.showError("There was an error subscribing. Please try again.")
    }
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  disableSubmit() {
    this.submitTarget.disabled = true
    this.submitTarget.textContent = "Subscribing..."
    this.submitTarget.classList.add("loading")
  }
  
  enableSubmit() {
    this.submitTarget.disabled = false
    this.submitTarget.textContent = "Subscribe"
    this.submitTarget.classList.remove("loading")
  }
  
  showError(message) {
    this.showMessage(message, "error")
  }
  
  showSuccess(message) {
    this.showMessage(message, "success")
  }
  
  showMessage(message, type) {
    if (this.hasMessageTarget) {
      this.messageTarget.textContent = message
      this.messageTarget.className = `text-sm mt-2 ${type === "error" ? "text-red-400" : "text-green-400"}`
      this.messageTarget.style.display = "block"
      
      // Auto-hide success messages after 5 seconds
      if (type === "success") {
        setTimeout(() => {
          this.clearMessage()
        }, 5000)
      }
    }
  }
  
  clearMessage() {
    if (this.hasMessageTarget) {
      this.messageTarget.style.display = "none"
    }
  }
  
  resetForm() {
    if (this.hasEmailTarget) {
      this.emailTarget.value = ""
    }
    this.clearMessage()
  }
}
