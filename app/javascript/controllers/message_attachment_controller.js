import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="message-attachment"
export default class extends Controller {
  static targets = ["image"]
  
  connect() {
    // Handle image loading for newly added messages
    this.handleImageLoading()
    
    // Check if we need to refresh this message (for Turbo Stream updates)
    this.checkForRefresh()
  }
  
  handleImageLoading() {
    // Find all images in this message that might need retry logic
    const images = this.element.querySelectorAll('img[src*="rails/active_storage"]')
    
    images.forEach(img => {
      // Add error handling for broken images
      img.addEventListener('error', () => {
        this.handleImageError(img)
      })
      
      // Add load handling for successful images
      img.addEventListener('load', () => {
        this.handleImageLoad(img)
      })
      
      // If image is already broken, handle it immediately
      if (img.complete && img.naturalWidth === 0) {
        this.handleImageError(img)
      }
    })
  }
  
  checkForRefresh() {
    // If this message has processing attachments, try to refresh it
    const processingElements = this.element.querySelectorAll('.animate-spin')
    if (processingElements.length > 0) {
      // Set up a timer to refresh this message after a delay
      setTimeout(() => {
        this.refreshMessage()
      }, 3000) // Refresh after 3 seconds
    }
  }
  
  refreshMessage() {
    // Get the message ID and room ID from the element
    const messageId = this.element.dataset.messageId
    const roomId = this.getRoomId()
    
    if (messageId && roomId) {
      // Make a request to refresh this specific message using the correct nested route
      fetch(`/rooms/${roomId}/messages/${messageId}/refresh`, {
        method: 'GET',
        headers: {
          'Accept': 'text/vnd.turbo-stream.html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.text())
      .then(html => {
        // Replace this message with the updated version
        this.element.outerHTML = html
      })
      .catch(error => {
        console.log('Message refresh failed:', error)
      })
    }
  }
  
  getRoomId() {
    // Try to get room ID from various sources
    // 1. Check if there's a data attribute on the message element
    const roomIdFromData = this.element.dataset.roomId
    if (roomIdFromData) return roomIdFromData
    
    // 2. Check the URL path
    const pathMatch = window.location.pathname.match(/\/rooms\/(\d+)/)
    if (pathMatch) return pathMatch[1]
    
    // 3. Check for room ID in the page
    const roomElement = document.querySelector('[data-room-id]')
    if (roomElement) return roomElement.dataset.roomId
    
    // 4. Check for room ID in the messages container
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      const roomIdFromContainer = messagesContainer.dataset.roomId
      if (roomIdFromContainer) return roomIdFromContainer
    }
    
    return null
  }
  
  handleImageError(img) {
    // Hide the broken image
    img.style.display = 'none'
    
    // Show fallback content
    const fallback = img.nextElementSibling
    if (fallback && fallback.classList.contains('hidden')) {
      fallback.classList.remove('hidden')
      fallback.classList.add('flex')
    }
    
    // Try to reload the image after a delay (in case it was a temporary issue)
    setTimeout(() => {
      const newSrc = img.src + '?t=' + Date.now()
      img.src = newSrc
      img.style.display = 'block'
      if (fallback) {
        fallback.classList.add('hidden')
        fallback.classList.remove('flex')
      }
    }, 2000) // Retry after 2 seconds
  }
  
  handleImageLoad(img) {
    // Image loaded successfully, hide any fallback content
    const fallback = img.nextElementSibling
    if (fallback && fallback.classList.contains('flex')) {
      fallback.classList.add('hidden')
      fallback.classList.remove('flex')
    }
  }
}
