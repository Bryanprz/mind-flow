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
    console.log('📝 Message form submitForm called')
    
    // Check if there's any content
    const content = this.contentTarget.value.trim()
    const hasContent = content && content !== '<div><br></div>' && content !== '<p><br></p>'
    
    // Check if there are any file attachments
    const fileInput = this.formTarget.querySelector('input[type="file"]')
    const hasAttachments = fileInput && fileInput.files && fileInput.files.length > 0
    
    console.log('📝 Form data:', { hasContent, hasAttachments, content: content.substring(0, 100) })
    
    // Only submit if there's content OR attachments
    if (!hasContent && !hasAttachments) {
      console.log('📝 No content or attachments, not submitting')
      return
    }
    
    // Store the content and attachments for optimistic message
    this.pendingContent = content
    this.pendingAttachments = hasAttachments
    
    // For instant feedback, show optimistic message immediately
    if (hasContent || hasAttachments) {
      this.showOptimisticMessage(content, hasAttachments)
    }
    
    // Ensure form data is properly captured before submission
    this.ensureFormDataIntegrity()
    
    // For text+image messages, clear the form immediately for better UX
    if (hasContent && hasAttachments) {
      // Clear form immediately for text+image messages
      setTimeout(() => {
        this.clearFormImmediately()
      }, 50) // Small delay to ensure form submission happens first
    }
    
    // Submit the form
    this.formTarget.requestSubmit()
  }
  
  ensureFormDataIntegrity() {
    // Ensure file input has the correct name attribute
    const fileInput = this.formTarget.querySelector('input[type="file"]')
    if (fileInput && !fileInput.name) {
      fileInput.name = 'message[attachments][]'
    }
    
    // Ensure form has proper encoding for file uploads
    if (!this.formTarget.enctype) {
      this.formTarget.enctype = 'multipart/form-data'
    }
    
    // Debug: Log form data before submission
    const formData = new FormData(this.formTarget)
    console.log('Form data before submission:')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }
  }

  showOptimisticMessage(content, hasAttachments) {
    // Check if there are already optimistic messages to prevent duplicates
    const existingOptimistic = document.querySelectorAll('[id^="optimistic_message_"]')
    if (existingOptimistic.length > 0) {
      // Remove existing optimistic messages first
      existingOptimistic.forEach(msg => msg.remove())
    }
    
    // Create optimistic message element
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer) return
    
    const optimisticId = 'optimistic_message_' + Date.now()
    const optimisticMessage = document.createElement('div')
    optimisticMessage.id = optimisticId
    optimisticMessage.className = 'chat chat-end optimistic-message'
    optimisticMessage.style.opacity = '0'
    optimisticMessage.style.transform = 'translateY(20px)'
    optimisticMessage.style.transition = 'all 0.3s ease-out'
    
    // Get optimistic images if attachments exist
    const optimisticImages = this.getOptimisticImages()
    
    optimisticMessage.innerHTML = `
      <div class="chat-image avatar">
        <div class="w-10 rounded-full overflow-hidden">
          <div class="w-full h-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
            ${document.querySelector('[data-current-user-name]')?.textContent?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
      <div class="chat-header text-primary text-right">
        You
        <time class="text-xs opacity-50">now</time>
      </div>
      <div class="chat-bubble chat-bubble-primary">
        ${content ? `<div class="flex items-center justify-center min-h-[2rem]">${content}</div>` : ''}
        ${hasAttachments ? `
          <div class="mt-2 flex flex-wrap gap-2">
            ${optimisticImages}
          </div>
        ` : ''}
      </div>
      <div class="chat-footer opacity-50 text-gray-400">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span>Sending...</span>
        </div>
      </div>
    `
    
    // Add to messages container
    messagesContainer.appendChild(optimisticMessage)
    
    // Animate in
    requestAnimationFrame(() => {
      optimisticMessage.style.opacity = '1'
      optimisticMessage.style.transform = 'translateY(0)'
    })
    
    // Scroll to bottom smoothly
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    })
    
    // Store reference for later removal
    this.optimisticMessageId = optimisticId
    
    // Remove optimistic message after a delay (in case server response is slow)
    setTimeout(() => {
      const optimisticEl = document.getElementById(optimisticId)
      if (optimisticEl) {
        this.fadeOutOptimisticMessage(optimisticEl)
      }
    }, 5000) // Remove after 5 seconds as fallback
  }
  
  fadeOutOptimisticMessage(element) {
    element.style.transition = 'all 0.3s ease-out'
    element.style.opacity = '0'
    element.style.transform = 'translateY(-10px)'
    
    setTimeout(() => {
      if (element.parentNode) {
        element.remove()
      }
    }, 300)
  }

  getOptimisticImages() {
    const fileInput = this.formTarget.querySelector('input[type="file"]')
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return ''
    }
    
    let imagesHtml = ''
    const files = Array.from(fileInput.files)
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Update the optimistic message with the actual image
          const optimisticEl = document.getElementById(this.optimisticMessageId)
          if (optimisticEl) {
            const imageContainer = optimisticEl.querySelector(`[data-optimistic-image="${index}"]`)
            if (imageContainer) {
              imageContainer.innerHTML = `
                <img src="${e.target.result}" class="max-w-xs max-h-48 rounded-lg object-cover" alt="Preview ${index + 1}">
                <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div class="flex items-center gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium">Processing...</span>
                  </div>
                </div>
              `
            }
          }
        }
        reader.readAsDataURL(file)
        
        // Create placeholder for the image
        imagesHtml += `
          <div class="relative rounded-lg" data-optimistic-image="${index}">
            <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        `
      }
    })
    
    return imagesHtml
  }

  clearFormImmediately() {
    // Clear the content
    if (this.hasContentTarget) {
      this.contentTarget.value = ''
      
      // For trix editor, also clear the editor content
      const trixEditor = this.contentTarget.querySelector('trix-editor')
      if (trixEditor) {
        trixEditor.innerHTML = ''
        // Trigger trix-change event to update the editor state
        trixEditor.dispatchEvent(new Event('trix-change', { bubbles: true }))
      }
      
      // Trigger input event to update any auto-resize controllers
      this.contentTarget.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Ensure the input maintains its minimum height and proper flex behavior after clearing
      setTimeout(() => {
        if (this.contentTarget.style.height && parseInt(this.contentTarget.style.height) < 40) {
          this.contentTarget.style.height = '40px'
        }
        
        // Ensure the input field maintains its flex properties
        this.contentTarget.style.flex = '1'
        this.contentTarget.style.minWidth = '0'
        
        // Ensure the parent container maintains its flex layout
        const inputField = this.formTarget.querySelector('[data-image-preview-target="inputField"]')
        if (inputField) {
          inputField.style.flex = '1'
          inputField.style.minWidth = '0'
        }
      }, 10)
    }
    
    // Clear file attachments
    const fileInput = this.formTarget.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
    
    // Clear any image previews immediately for better UX
    const imagePreviewController = this.application.getControllerForElementAndIdentifier(this.element, 'image-preview')
    if (imagePreviewController && imagePreviewController.clearPreviews) {
      imagePreviewController.clearPreviews()
    }
    
    // Also clear any preview containers manually
    const previewContainer = this.formTarget.querySelector('[data-image-preview-target="previewContainer"]')
    if (previewContainer) {
      previewContainer.classList.add('hidden')
    }
    
    const previewGrid = this.formTarget.querySelector('[data-image-preview-target="previewGrid"]')
    if (previewGrid) {
      previewGrid.innerHTML = ''
    }
    
    // Reset form state for immediate feedback
    this.formTarget.reset()
  }
}
