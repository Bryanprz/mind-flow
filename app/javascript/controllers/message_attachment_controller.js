import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="message-attachment"
export default class extends Controller {
  static targets = ["image"]
  
  connect() {
    // Initialize refresh counter
    this.refreshCount = 0
    this.maxRefreshes = 2 // Only allow 2 refresh attempts maximum
    
    // Handle image loading for newly added messages
    this.handleImageLoading()
    
    // Check if we need to refresh this message (for Turbo Stream updates)
    this.checkForRefresh()
    
    // For new messages with attachments, always try to refresh after a short delay
    const shouldAutoRefresh = this.element.dataset.autoRefresh === 'true'
    
    if (shouldAutoRefresh) {
      setTimeout(() => {
        this.refreshMessage()
      }, 2000) // Refresh after 2 seconds for new messages
    }
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
    const processingText = this.findElementByText('span', 'Processing image...')
    const hasProcessingIndicator = processingElements.length > 0 || processingText
    
    
    if (hasProcessingIndicator && this.refreshCount < this.maxRefreshes && !this.refreshScheduled) {
      // Set up a timer to refresh this message after a shorter delay
      // Only refresh once to avoid multiple requests
      this.refreshScheduled = true
      setTimeout(() => {
        this.refreshMessage()
      }, 3000) // Refresh after 3 seconds - shorter delay for better UX
    }
  }
  
  refreshMessage() {
    // Increment refresh counter
    this.refreshCount++
    
    // Check if message has attachments and if images are actually visible
    const hasAttachments = this.element.dataset.hasAttachments === 'true'
    const visibleImages = this.element.querySelectorAll('img[src*="rails/active_storage"]:not([style*="display: none"])')
    const processingElements = this.element.querySelectorAll('.animate-spin')
    const processingText = this.findElementByText('span', 'Processing image...')
    const hasProcessingIndicator = processingElements.length > 0 || processingText
    
    
    // Refresh if we have attachments but no visible images, or if there are still processing elements
    if (!hasAttachments) {
      return
    }
    
    if (visibleImages.length > 0 && !hasProcessingIndicator) {
      return
    }
    
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
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(html => {
        // Use Turbo to handle the stream properly instead of manual replacement
        Turbo.renderStreamMessage(html)
      })
      .catch(error => {
        // Don't remove the message if refresh fails
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
  
  findElementByText(selector, text) {
    // Helper method to find an element by text content (replaces :contains() pseudo-selector)
    const elements = this.element.querySelectorAll(selector)
    for (let element of elements) {
      if (element.textContent.includes(text)) {
        return element
      }
    }
    return null
  }
}
