import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.autoScrollEnabled = true
    
    // Store initial scroll position to detect if user has scrolled up
    this.initialScrollTop = this.element.scrollTop
    this.userHasScrolledUp = false
    
    // Listen for scroll events to track user behavior
    this.element.addEventListener('scroll', () => {
      this.handleUserScroll()
    })
    
    // Position at bottom after DOM is ready
    this.ensureBottomPosition()
    
    // Listen for turbo:frame-render to auto-scroll when new messages arrive
    this.element.addEventListener('turbo:frame-render', () => {
      if (this.autoScrollEnabled && this.isNearBottom()) {
        // Immediately position at bottom without delay
        this.scrollToBottom()
      }
    })
    
    // Listen for turbo:stream-render to auto-scroll when new messages arrive via Turbo Streams
    this.element.addEventListener('turbo:stream-render', (event) => {
      if (this.autoScrollEnabled) {
        // Remove optimistic messages immediately when turbo stream renders
        this.removeOptimisticMessages()
        
        // Only auto-scroll if user is near the bottom (not scrolled up)
        if (this.isNearBottom()) {
          // Immediately position at bottom without delay
          this.scrollToBottom()
        }
      }
    })
    
    // Listen for DOM changes to auto-scroll when new messages are added
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if the added nodes are actual messages, not image previews
          const isMessageAddition = Array.from(mutation.addedNodes).some(node => {
            return node.nodeType === Node.ELEMENT_NODE && 
                   (node.classList?.contains('message') || 
                    node.querySelector?.('.message') ||
                    node.getAttribute?.('data-controller')?.includes('message') ||
                    node.id?.startsWith('message_') ||
                    node.classList?.contains('chat'))
          })
          
          // Check if image previews are being added (which should maintain bottom scroll)
          const isImagePreviewAddition = Array.from(mutation.addedNodes).some(node => {
            return node.nodeType === Node.ELEMENT_NODE && 
                   (node.classList?.contains('image-preview') || 
                    node.querySelector?.('.image-preview') ||
                    node.querySelector?.('[data-image-preview-target]'))
          })
          
          // Auto-scroll for message additions
          if (isMessageAddition && this.autoScrollEnabled) {
            // Remove optimistic messages immediately when real messages arrive
            // to prevent duplicates from appearing
            this.removeOptimisticMessages()
            
            // Only auto-scroll if user is near the bottom (not scrolled up)
            if (this.isNearBottom()) {
              // Immediately position at bottom without delay
              this.scrollToBottom()
            }
          }
          
          // Maintain bottom scroll for image preview additions
          if (isImagePreviewAddition && this.autoScrollEnabled && this.isNearBottom()) {
            // Immediately position at bottom without delay
            this.scrollToBottom()
          }
        }
      })
    })
    
    // Start observing
    this.observer.observe(this.element, {
      childList: true,
      subtree: true
    })
    
    // Listen for image load events to handle height changes
    this.element.addEventListener('load', (event) => {
      if (event.target.tagName === 'IMG' && this.autoScrollEnabled) {
        // Image has loaded, scroll to bottom to account for height change
        setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      }
    }, true) // Use capture phase to catch all image loads
    
    // Also listen for image error events (fallback images)
    this.element.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG' && this.autoScrollEnabled) {
        // Image failed to load, but layout might still change
        setTimeout(() => {
          this.scrollToBottom()
        }, 50)
      }
    }, true)
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  
  ensureBottomPosition() {
    // Use multiple attempts to ensure we're at the bottom
    const attemptPositioning = () => {
      this.positionAtBottom()
      
      // Try again after a short delay to handle any layout changes
      setTimeout(() => {
        this.positionAtBottom()
      }, 10)
      
      // Final attempt after images and content load
      setTimeout(() => {
        this.positionAtBottom()
      }, 100)
    }
    
    // Try immediately
    attemptPositioning()
    
    // Also try when DOM is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(attemptPositioning, 50)
    } else {
      window.addEventListener('load', () => {
        setTimeout(attemptPositioning, 50)
      })
    }
  }
  
  positionAtBottom() {
    // Immediately position at bottom without any animation or delay
    console.log('Positioning at bottom:', {
      scrollTop: this.element.scrollTop,
      scrollHeight: this.element.scrollHeight,
      clientHeight: this.element.clientHeight
    })
    
    // Force scroll to the very bottom
    this.element.scrollTop = this.element.scrollHeight
    
    console.log('After positioning:', {
      scrollTop: this.element.scrollTop,
      scrollHeight: this.element.scrollHeight,
      clientHeight: this.element.clientHeight
    })
  }
  
  scrollToBottom() {
    // Fast scroll to bottom without animation
    this.element.scrollTop = this.element.scrollHeight
  }
  
  isNearBottom() {
    const threshold = 100 // pixels from bottom
    const scrollTop = this.element.scrollTop
    const scrollHeight = this.element.scrollHeight
    const clientHeight = this.element.clientHeight
    
    return (scrollTop + clientHeight) >= (scrollHeight - threshold)
  }
  
  // Method to track user scroll behavior
  handleUserScroll() {
    if (this.isNearBottom()) {
      this.userHasScrolledUp = false
    } else {
      this.userHasScrolledUp = true
    }
  }
  
  // Method to temporarily disable auto-scrolling
  disableAutoScroll() {
    this.autoScrollEnabled = false
  }
  
  // Method to re-enable auto-scrolling
  enableAutoScroll() {
    this.autoScrollEnabled = true
  }
  
  // Method to manually scroll to bottom (ignores auto-scroll setting)
  forceScrollToBottom() {
    this.scrollToBottom()
  }
  
  // Method to handle image preview additions - maintains bottom scroll
  handleImagePreviewAddition() {
    if (this.autoScrollEnabled) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        this.scrollToBottom()
      })
    }
  }
  
  // Method to handle image height changes - scrolls to bottom when images load
  handleImageHeightChange() {
    if (this.autoScrollEnabled) {
      // Use multiple timeouts to handle different loading phases
      setTimeout(() => {
        this.scrollToBottom()
      }, 50)
      
      setTimeout(() => {
        this.scrollToBottom()
      }, 200)
      
      setTimeout(() => {
        this.scrollToBottom()
      }, 500)
    }
  }
  
  // Method to remove optimistic messages when real messages arrive
  removeOptimisticMessages() {
    const optimisticMessages = this.element.querySelectorAll('[id^="optimistic_message_"]')
    optimisticMessages.forEach(msg => {
      // Remove immediately to prevent duplicates
      this.removeOptimisticMessageImmediately(msg)
    })
  }
  
  removeOptimisticMessageImmediately(element) {
    // Remove immediately without animation to prevent duplicates
    if (element.parentNode) {
      element.remove()
    }
  }
  
  fadeOutOptimisticMessage(element) {
    // Add a smooth fade out effect for timeout-based removal
    element.style.transition = 'all 0.3s ease-out'
    element.style.opacity = '0'
    element.style.transform = 'translateY(-10px) scale(0.98)'
    
    setTimeout(() => {
      if (element.parentNode) {
        element.remove()
      }
    }, 300)
  }
}