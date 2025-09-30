import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["loadMoreTrigger"]
  static values = { 
    roomId: Number,
    hasMoreMessages: Boolean,
    loading: Boolean
  }

  connect() {
    this.setupScrollListener()
    this.createLoadMoreTrigger()
  }

  disconnect() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener)
    }
  }

  setupScrollListener() {
    this.scrollListener = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.scrollListener, { passive: true })
  }

  handleScroll() {
    if (this.loadingValue || !this.hasMoreMessagesValue) {
      return
    }

    const messagesContainer = this.element
    const scrollTop = messagesContainer.scrollTop
    const threshold = 100 // Load more when 100px from top (more responsive)

    if (scrollTop <= threshold) {
      this.loadMoreMessages()
    }
  }

  createLoadMoreTrigger() {
    if (!this.hasMoreMessagesValue) {
      return
    }

    // Create a trigger element at the top of messages
    const trigger = document.createElement('div')
    trigger.id = 'load-more-trigger'
    trigger.className = 'text-center py-4 text-gray-500 text-sm'
    trigger.innerHTML = 'Scroll up to load older messages...'
    
    // Insert at the beginning of messages container
    this.element.insertBefore(trigger, this.element.firstChild)
  }

  async loadMoreMessages() {
    if (this.loadingValue || !this.hasMoreMessagesValue) {
      return
    }

    this.loadingValue = true
    this.updateLoadingState(true)

    try {
      // Get the first message ID (oldest visible message)
      const firstMessage = this.element.querySelector('.chat')
      if (!firstMessage) {
        return
      }

      const firstMessageId = firstMessage.id.replace('message_', '')
      
      // Make request to load more messages
      const response = await fetch(`/rooms/${this.roomIdValue}/load_more_messages?last_message_id=${firstMessageId}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/vnd.turbo-stream.html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (response.ok) {
        const turboStream = await response.text()
        Turbo.renderStreamMessage(turboStream)
        
        // Update hasMoreMessages value based on response
        // This would need to be handled by the server response
        // For now, we'll assume there are more messages until we get a signal otherwise
      }
    } catch (error) {
      console.error('Error loading more messages:', error)
    } finally {
      this.loadingValue = false
      this.updateLoadingState(false)
    }
  }

  updateLoadingState(loading) {
    const trigger = document.getElementById('load-more-trigger')
    if (trigger) {
      if (loading) {
        trigger.innerHTML = '<div class="flex items-center justify-center gap-2"><div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>Loading older messages...</div>'
      } else {
        trigger.innerHTML = 'Scroll up to load older messages...'
      }
    }
  }

  // Method to be called when there are no more messages
  noMoreMessages() {
    this.hasMoreMessagesValue = false
    const trigger = document.getElementById('load-more-trigger')
    if (trigger) {
      trigger.innerHTML = 'No more messages to load'
      trigger.className = 'text-center py-4 text-gray-400 text-sm'
    }
  }
}
