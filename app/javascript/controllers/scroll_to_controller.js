import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.scrollToBottom()
    
    // Listen for turbo:frame-render to auto-scroll when new messages arrive
    this.element.addEventListener('turbo:frame-render', () => {
      this.scrollToBottom()
    })
    
    // Listen for turbo:stream-render to auto-scroll when new messages arrive via Turbo Streams
    this.element.addEventListener('turbo:stream-render', (event) => {
      this.scrollToBottom()
    })
    
    // Listen for DOM changes to auto-scroll when new messages are added
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.scrollToBottom()
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
}