import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Listen for new messages being added to the DOM
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if the added nodes are messages
          Array.from(mutation.addedNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('chat')) {
              this.fixMessagePositioning(node)
            }
          })
        }
      })
    })
    
    // Start observing
    this.observer.observe(this.element, { childList: true, subtree: true })
    
    // Fix positioning for existing messages on page load
    this.fixAllMessagePositions()
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  
  fixAllMessagePositions() {
    const messages = this.element.querySelectorAll('.chat')
    messages.forEach(message => this.fixMessagePositioning(message))
  }
  
  fixMessagePositioning(messageElement) {
    // Get user IDs from data attributes
    const messageUserId = messageElement.dataset.userId
    const currentUserId = this.getCurrentUserId()
    
    if (messageUserId && currentUserId) {
      const isCurrentUser = messageUserId === currentUserId
      
      // Update the chat positioning classes
      if (isCurrentUser) {
        messageElement.classList.remove('chat-start')
        messageElement.classList.add('chat-end')
        
        // Update chat bubble class
        const chatBubble = messageElement.querySelector('.chat-bubble')
        if (chatBubble) {
          chatBubble.classList.remove('chat-bubble-secondary')
          chatBubble.classList.add('chat-bubble-primary')
        }
        
        // Update chat header alignment
        const chatHeader = messageElement.querySelector('.chat-header')
        if (chatHeader) {
          chatHeader.classList.remove('text-secondary')
          chatHeader.classList.add('text-primary', 'text-right')
        }
      } else {
        messageElement.classList.remove('chat-end')
        messageElement.classList.add('chat-start')
        
        // Update chat bubble class
        const chatBubble = messageElement.querySelector('.chat-bubble')
        if (chatBubble) {
          chatBubble.classList.remove('chat-bubble-primary')
          chatBubble.classList.add('chat-bubble-secondary')
        }
        
        // Update chat header alignment
        const chatHeader = messageElement.querySelector('.chat-header')
        if (chatHeader) {
          chatHeader.classList.remove('text-primary', 'text-right')
          chatHeader.classList.add('text-secondary')
        }
      }
    }
  }
  
  getCurrentUserId() {
    // Try to get current user ID from meta tag
    const metaTag = document.querySelector('meta[name="current-user-id"]')
    return metaTag ? metaTag.content : null
  }
}
