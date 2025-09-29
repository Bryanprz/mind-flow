import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.autoScrollEnabled = true
    
    // Ensure we scroll to bottom on page load/reload
    this.scrollToBottom()
    
    // Add a small delay to ensure content is fully loaded
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
    
    // Also scroll when the page is fully loaded (for page reloads)
    if (document.readyState === 'complete') {
      setTimeout(() => {
        this.scrollToBottom()
      }, 200)
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.scrollToBottom()
        }, 200)
      })
    }
    
    // Listen for turbo:frame-render to auto-scroll when new messages arrive
    this.element.addEventListener('turbo:frame-render', () => {
      if (this.autoScrollEnabled) {
        this.scrollToBottom()
      }
    })
    
    // Listen for turbo:stream-render to auto-scroll when new messages arrive via Turbo Streams
    this.element.addEventListener('turbo:stream-render', (event) => {
      if (this.autoScrollEnabled) {
        this.scrollToBottom()
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
                    node.getAttribute?.('data-controller')?.includes('message'))
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
            this.scrollToBottom()
          }
          
          // Maintain bottom scroll for image preview additions
          if (isImagePreviewAddition && this.autoScrollEnabled) {
            // Use a small delay to ensure the preview is rendered
            setTimeout(() => {
              this.scrollToBottom()
            }, 50)
          }
        }
      })
    })
    
    // Start observing
    this.observer.observe(this.element, {
      childList: true,
      subtree: true
    })
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  
  scrollToBottom() {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      this.element.scrollTop = this.element.scrollHeight
    })
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
}