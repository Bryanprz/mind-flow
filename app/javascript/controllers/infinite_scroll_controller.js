import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    roomId: String,
    hasMoreMessages: Boolean
  }

  connect() {
    console.log('🔗 Infinite scroll controller connected')
    this.loading = false
    this.lastMessageId = null
    this.hasMoreMessages = this.hasMoreMessagesValue
    
    // Find the oldest message ID for initial load more trigger
    this.setupInitialTrigger()
  }

  setupInitialTrigger() {
    // Find the first (oldest) message to get its ID
    const firstMessage = this.element.querySelector('[data-message-id]')
    if (firstMessage) {
      this.lastMessageId = firstMessage.dataset.messageId
      console.log('🔍 Initial last message ID:', this.lastMessageId)
    } else {
      console.log('⚠️ No messages found to get initial ID')
    }
  }

  loadMore() {
    console.log('🔄 loadMore called', {
      loading: this.loading,
      hasMoreMessages: this.hasMoreMessages,
      lastMessageId: this.lastMessageId
    })
    
    if (this.loading || !this.hasMoreMessages || !this.lastMessageId) {
      console.log('⚠️ Skipping load more due to conditions')
      return
    }

    this.loading = true
    console.log('🔄 Loading more messages, last ID:', this.lastMessageId)

    // Show loading indicator
    this.showLoadingIndicator()

    // Make the request
    fetch(`/rooms/${this.roomIdValue}/load_more_messages?last_message_id=${this.lastMessageId}`, {
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
      console.log('📡 Received response, processing...')
      // Parse and execute the turbo stream response
      Turbo.renderStreamMessage(html)
      
      // Update the last message ID and has more status
      this.updateStateAfterLoad()
    })
    .catch(error => {
      console.error('❌ Error loading more messages:', error)
      this.hideLoadingIndicator()
      this.loading = false
    })
  }

  updateStateAfterLoad() {
    // Find the new oldest message (first in the container)
    const firstMessage = this.element.querySelector('[data-message-id]')
    if (firstMessage) {
      this.lastMessageId = firstMessage.dataset.messageId
      console.log('✅ Updated last message ID:', this.lastMessageId)
    }

    // Check if we still have more messages by looking at the trigger element
    const trigger = this.element.querySelector('#load_more_trigger')
    if (trigger) {
      this.hasMoreMessages = trigger.dataset.hasMoreMessages === 'true'
      console.log('✅ Has more messages:', this.hasMoreMessages)
    }

    this.hideLoadingIndicator()
    this.loading = false
  }

  showLoadingIndicator() {
    const trigger = this.element.querySelector('#load_more_trigger')
    if (trigger) {
      trigger.innerHTML = `
        <div class="flex items-center justify-center py-4">
          <div class="flex items-center gap-2 text-gray-500">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading older messages...</span>
          </div>
        </div>
      `
    }
  }

  hideLoadingIndicator() {
    const trigger = this.element.querySelector('#load_more_trigger')
    if (trigger && this.hasMoreMessages) {
      trigger.innerHTML = `
        <div class="flex items-center justify-center py-4">
          <button 
            data-action="click->infinite-scroll#loadMore"
            class="text-primary hover:text-primary-focus text-sm font-medium px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            Load older messages
          </button>
        </div>
      `
    } else if (trigger) {
      trigger.innerHTML = `
        <div class="flex items-center justify-center py-4">
          <span class="text-gray-400 text-sm">No more messages</span>
        </div>
      `
    }
  }

  // Handle turbo stream updates
  afterLoadMore(event) {
    console.log('📡 After load more event received')
    this.updateStateAfterLoad()
  }
}