import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Auto-scroll to bottom on initial load
    this.scrollToBottom()
    
    // Listen for new messages being added via Turbo Streams
    this.element.addEventListener('turbo:stream-render', () => {
      this.scrollToBottom()
    })
    
    // Listen for DOM changes to auto-scroll when new messages are added
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if the added nodes are actual messages
          const isMessageAddition = Array.from(mutation.addedNodes).some(node => {
            return node.nodeType === Node.ELEMENT_NODE && 
                   (node.classList?.contains('chat') ||
                    node.id?.startsWith('message_'))
          })
          
          if (isMessageAddition) {
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
      if (event.target.tagName === 'IMG') {
        // Image has loaded, scroll to bottom to account for height change
        setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      }
    }, true) // Use capture phase to catch all image loads
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight
  }

  // Methods needed by image preview controller
  disableAutoScroll() {
    // Disable auto-scroll temporarily
    this.autoScrollEnabled = false
  }

  enableAutoScroll() {
    // Re-enable auto-scroll
    this.autoScrollEnabled = true
  }

  storeScrollPosition() {
    // Store current scroll position
    this.storedScrollTop = this.element.scrollTop
  }

  restoreScrollPosition() {
    // Restore scroll position
    if (this.storedScrollTop !== undefined) {
      this.element.scrollTop = this.storedScrollTop
    }
  }

}