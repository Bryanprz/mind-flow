import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["field", "form"]
  static values = { 
    url: String,
    fieldName: String 
  }

  connect() {
    console.log("InlineEdit controller connected", this.element)
  }

  updateField(event) {
    const fieldName = event.target.dataset.inlineEditFieldNameValue
    const fieldElement = document.querySelector(`[name="chronic_illness[${fieldName}]"]`)
    const fieldValue = fieldElement.value
    
    if (!fieldValue.trim()) {
      alert(`Please enter a value for ${fieldName}`)
      return
    }

    // Show loading state
    this.showLoading(event.target)

    // Create form data
    const formData = new FormData()
    formData.append(`chronic_illness[${fieldName}]`, fieldValue)

    // Submit via fetch with redirect handling
    fetch(this.urlValue, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Accept': 'text/html',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      redirect: 'manual' // Don't follow redirects automatically
    })
    .then(response => {
      if (response.ok || response.status === 302) {
        this.showSuccess(event.target)
        // Reload page to show updated content
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        this.showError(event.target)
      }
    })
    .catch(error => {
      console.error('Error:', error)
      this.showError(event.target)
    })
  }

  showLoading(button) {
    const originalHTML = button.innerHTML
    button.innerHTML = '<span class="loading loading-spinner loading-xs"></span>'
    button.disabled = true
    button.dataset.originalHTML = originalHTML
  }

  showSuccess(button) {
    button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
    button.classList.remove('btn-primary')
    button.classList.add('btn-success')
    
    // Reset after 2 seconds
    setTimeout(() => {
      this.resetButton(button)
    }, 2000)
  }

  showError(button) {
    button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
    button.classList.remove('btn-primary')
    button.classList.add('btn-error')
    
    // Reset after 2 seconds
    setTimeout(() => {
      this.resetButton(button)
    }, 2000)
  }

  resetButton(button) {
    button.innerHTML = button.dataset.originalHTML || '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>'
    button.disabled = false
    button.classList.remove('btn-success', 'btn-error')
    button.classList.add('btn-primary')
  }
}