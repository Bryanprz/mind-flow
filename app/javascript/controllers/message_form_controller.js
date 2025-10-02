import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  connect() {
    // Store the initial input width to prevent shrinking
    this.storeInitialWidth()
  }

  storeInitialWidth() {
    const inputElement = this.contentTarget
    if (inputElement) {
      // Store the initial width of the input container
      const inputContainer = inputElement.closest('.flex-1')
      if (inputContainer) {
        this.initialWidth = inputContainer.offsetWidth
        this.initialMinWidth = inputContainer.style.minWidth || '200px'
      }
    }
  }

  handleKeydown(event) {
    // If Enter is pressed without Shift, validate and submit the form
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      
      // Validate before submitting
      if (this.validateMessage()) {
        this.element.requestSubmit()
      }
    }
    // If Shift+Enter is pressed, allow default behavior (line break)
  }

  validateMessage() {
    const content = this.getContentText()
    const hasAttachments = this.hasAttachments()
    
    // Allow empty messages only if there are attachments
    if (content.trim() === '' && !hasAttachments) {
      this.showValidationError("Please enter a message or attach an image")
      return false
    }
    
    // Clear any previous validation errors
    this.clearValidationError()
    return true
  }

  getContentText() {
    const trixEditor = this.contentTarget.querySelector('trix-editor')
    if (trixEditor) {
      return trixEditor.textContent.trim()
    }
    return this.contentTarget.value?.trim() || ''
  }

  hasAttachments() {
    // Check if there are any file inputs with files
    const fileInputs = this.element.querySelectorAll('input[type="file"]')
    for (const input of fileInputs) {
      if (input.files && input.files.length > 0) {
        return true
      }
    }
    
    // Check if there are any image previews (indicating files are selected)
    const previewGrid = this.element.querySelector('[data-image-preview-target="previewGrid"]')
    if (previewGrid && previewGrid.children.length > 0) {
      return true
    }
    
    return false
  }

  showValidationError(message) {
    // Remove any existing error message
    this.clearValidationError()
    
    // Create error message element
    const errorDiv = document.createElement('div')
    errorDiv.className = 'text-red-500 text-sm mt-1 validation-error'
    errorDiv.textContent = message
    
    // Insert below the entire input row (after the flex container with input and icons)
    const inputRow = this.contentTarget.closest('.flex.items-center.gap-3')
    if (inputRow) {
      inputRow.parentNode.insertBefore(errorDiv, inputRow.nextSibling)
    } else {
      // Fallback: insert after the input container
      const inputContainer = this.contentTarget.closest('.flex-1')
      if (inputContainer) {
        inputContainer.parentNode.insertBefore(errorDiv, inputContainer.nextSibling)
      }
    }
    
    // Prevent input width from shrinking by maintaining minimum width
    this.maintainInputWidth()
  }

  clearValidationError() {
    const existingError = this.element.querySelector('.validation-error')
    if (existingError) {
      existingError.remove()
    }
  }

  maintainInputWidth() {
    const inputContainer = this.contentTarget.closest('.flex-1')
    if (inputContainer && this.initialWidth) {
      // Ensure the input container maintains its width
      inputContainer.style.minWidth = `${this.initialWidth}px`
      inputContainer.style.flex = '1 1 auto'
    }
  }

  // Override the form submission to always validate first
  handleFormSubmit(event) {
    if (!this.validateMessage()) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    
    // If validation passes, maintain input width during submission
    this.maintainInputWidth()
    return true
  }
}