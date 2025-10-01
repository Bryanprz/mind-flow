import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Add click handlers to all images in chat bubbles
    this.addImageClickHandlers()
    
    // Add ESC key listener
    this.escapeHandler = this.handleEscape.bind(this)
    document.addEventListener('keydown', this.escapeHandler)
    
    // Listen for new messages being added (for infinite scroll)
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Skip non-message elements like infinite scroll triggers
              if (node.id === 'load-more-trigger' || node.classList.contains('text-center')) {
                return
              }
              
              // Only process actual message elements
              if (node.classList.contains('chat') || node.querySelector('.chat')) {
                // Check if the added node contains chat images
                const images = node.querySelectorAll ? node.querySelectorAll('.chat-bubble img') : []
                images.forEach(img => {
                  img.style.cursor = 'pointer'
                  img.addEventListener('click', (e) => {
                    e.preventDefault()
                    this.openModal(img.src, img.alt)
                  })
                })
              }
            }
          })
        }
      })
    })
    
    // Start observing the messages container for changes
    this.observer.observe(this.element, { childList: true, subtree: true })
  }
  
  disconnect() {
    // Remove ESC key listener
    document.removeEventListener('keydown', this.escapeHandler)
    
    // Stop observing
    if (this.observer) {
      this.observer.disconnect()
    }
    
    // Remove modal if it exists
    const existingModal = document.getElementById('image-modal')
    if (existingModal) {
      existingModal.remove()
    }
  }
  
  addImageClickHandlers() {
    // Find all images in chat bubbles and add click handlers
    const chatImages = document.querySelectorAll('.chat-bubble img')
    chatImages.forEach(img => {
      img.style.cursor = 'pointer'
      img.addEventListener('click', (e) => {
        e.preventDefault()
        this.openModal(img.src, img.alt)
      })
    })
  }
  
  openModal(event) {
    // Handle both direct calls and event-based calls
    let imageSrc, imageAlt
    if (event && event.target) {
      // Called from click event
      imageSrc = event.target.src
      imageAlt = event.target.alt || ''
    } else {
      // Called directly with parameters
      imageSrc = arguments[0]
      imageAlt = arguments[1] || ''
    }
    
    // Remove existing modal if it exists
    const existingModal = document.getElementById('image-modal')
    if (existingModal) {
      existingModal.remove()
    }
    
    // Create new modal
    this.createModal(imageSrc, imageAlt)
  }
  
  closeModal() {
    const modal = document.getElementById('image-modal')
    if (modal) {
      modal.classList.add('hidden')
      document.body.style.overflow = '' // Restore scrolling
    }
  }
  
  handleEscape(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('image-modal')
      if (modal && !modal.classList.contains('hidden')) {
        this.closeModal()
      }
    }
  }
  
  handleBackdropClick(event) {
    // Close modal if clicking on the backdrop (not the image)
    if (event.target.id === 'image-modal') {
      this.closeModal()
    }
  }
  
  createModal(imageSrc, imageAlt = '') {
    const modalHTML = `
      <div id="image-modal" 
           class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
           data-action="click->image-modal#handleBackdropClick">
        <div class="relative w-full h-full flex items-center justify-center">
          <!-- Close button -->
          <button id="close-image-modal"
                  class="absolute top-4 left-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
                  data-action="click->image-modal#closeModal"
                  aria-label="Close image">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <!-- Image -->
          <img id="modal-image"
               class="max-w-full max-h-full w-auto h-auto object-contain"
               style="max-width: 100vw; max-height: 100vh; width: auto; height: auto;"
               src="${imageSrc}"
               alt="${imageAlt}">
        </div>
      </div>
    `
    
    // Insert the modal into the body
    document.body.insertAdjacentHTML('beforeend', modalHTML)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
    
    // Focus the close button for accessibility
    const closeButton = document.getElementById('close-image-modal')
    if (closeButton) {
      closeButton.focus()
    }
  }
}
