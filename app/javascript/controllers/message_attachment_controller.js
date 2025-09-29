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
    console.log(`🔍 Processing elements found: ${processingElements.length}, refresh count: ${this.refreshCount}, scheduled: ${this.refreshScheduled}`)
    
    if (processingElements.length > 0 && this.refreshCount < this.maxRefreshes && !this.refreshScheduled) {
      console.log(`Found processing elements, will refresh message in 15 seconds (attempt ${this.refreshCount + 1}/${this.maxRefreshes})`)
      // Set up a timer to refresh this message after a longer delay
      // Only refresh once to avoid multiple requests
      this.refreshScheduled = true
      setTimeout(() => {
        this.refreshMessage()
      }, 15000) // Refresh after 15 seconds - even longer delay
    } else if (this.refreshCount >= this.maxRefreshes) {
      console.log('Maximum refresh attempts reached, stopping refresh loop')
    } else if (processingElements.length === 0 && !this.refreshScheduled) {
      console.log('No processing elements found, no refresh needed')
    } else if (this.refreshScheduled) {
      console.log('Refresh already scheduled, skipping')
    }
  }
  
  refreshMessage() {
    // Increment refresh counter
    this.refreshCount++
    
    // Check if message still has processing elements before refreshing
    const processingElements = this.element.querySelectorAll('.animate-spin')
    if (processingElements.length === 0) {
      console.log('No processing elements found, skipping refresh')
      return
    }
    
    // Get the message ID and room ID from the element
    const messageId = this.element.dataset.messageId
    const roomId = this.getRoomId()
    
    if (messageId && roomId) {
      console.log(`Refreshing message: ${messageId} (attempt ${this.refreshCount}/${this.maxRefreshes})`)
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
        console.log('Message refresh response received')
        // Use Turbo to handle the stream properly instead of manual replacement
        Turbo.renderStreamMessage(html)
      })
      .catch(error => {
        console.log('Message refresh failed:', error)
        // Don't remove the message if refresh fails
      })
    } else {
      console.log('Cannot refresh message - missing messageId or roomId')
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
