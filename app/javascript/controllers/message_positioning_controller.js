import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { currentUserId: String }
  
  connect() {
    // Position messages when they are added to the DOM
    this.positionMessages()
    
    // Listen for new messages being added via Turbo Streams
    this.element.addEventListener('turbo:stream-render', () => {
      setTimeout(() => this.positionMessages(), 10)
    })
    
    // Listen for DOM changes to position new messages
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setTimeout(() => this.positionMessages(), 10)
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
  
  positionMessages() {
    const currentUserId = this.currentUserIdValue
    if (!currentUserId) return
    
    // Find all message elements that need positioning
    const messageElements = this.element.querySelectorAll('[data-message-user-id]')
    
    messageElements.forEach(element => {
      const messageUserId = element.dataset.messageUserId
      const isCurrentUser = messageUserId === currentUserId
      
      // Update positioning classes
      if (isCurrentUser) {
        element.classList.remove('chat-start')
        element.classList.add('chat-end')
      } else {
        element.classList.remove('chat-end')
        element.classList.add('chat-start')
      }
      
      // Update header styling
      const header = element.querySelector('.chat-header')
      if (header) {
        if (isCurrentUser) {
          header.classList.remove('text-secondary')
          header.classList.add('text-primary')
        } else {
          header.classList.remove('text-primary')
          header.classList.add('text-secondary')
        }
      }
      
      // Update bubble styling
      const bubble = element.querySelector('.chat-bubble')
      if (bubble) {
        if (isCurrentUser) {
          bubble.classList.remove('chat-bubble-secondary')
          bubble.classList.add('chat-bubble-primary')
        } else {
          bubble.classList.remove('chat-bubble-primary')
          bubble.classList.add('chat-bubble-secondary')
        }
      }
    })
  }
}
