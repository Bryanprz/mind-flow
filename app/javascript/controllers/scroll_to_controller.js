import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.autoScrollEnabled = true
    this.scrollToBottom()
    
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
          
          // Only auto-scroll for actual message additions, not image previews
          if (isMessageAddition && this.autoScrollEnabled) {
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
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  
  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight
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
}