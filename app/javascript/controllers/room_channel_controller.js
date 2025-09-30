import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { roomId: Number, currentUserId: Number }

  connect() {
    this.subscribeToRoom()
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  subscribeToRoom() {
    console.log('🔌 Attempting to subscribe to room channel:', this.roomIdValue)
    
    if (window.App && window.App.cable) {
      this.subscription = window.App.cable.subscriptions.create(
        { channel: "RoomChannel", id: this.roomIdValue },
        {
          connected: () => {
            console.log('✅ Connected to room channel for room:', this.roomIdValue)
          },
          received: (data) => {
            console.log('📨 Received data from room channel:', data)
            
            // Handle new message data format
            if (data && data.type === 'new_message') {
              this.handleNewMessage(data)
            }
            // Process the Turbo Stream (fallback)
            else if (data && typeof data === 'string') {
              // Let Turbo handle the stream
              Turbo.renderStreamMessage(data)
            }
          },
          disconnected: () => {
            console.log('❌ Disconnected from room channel for room:', this.roomIdValue)
          }
        }
      )
    } else {
      console.log('⏳ ActionCable not ready, retrying in 500ms...')
      setTimeout(() => this.subscribeToRoom(), 500)
    }
  }

  handleNewMessage(data) {
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer) return

    // Determine if this is the current user's message
    const isCurrentUser = data.user_id === this.currentUserIdValue
    
    // Create message HTML with proper styling (matching the original partial)
    const messageHtml = `
      <div id="message_${data.message_id}" class="chat ${isCurrentUser ? 'chat-end' : 'chat-start'}" 
           data-controller="message-attachment avatar-loader"
           data-message-id="${data.message_id}"
           data-message-user-id="${data.user_id}"
           data-current-user-id="${this.currentUserIdValue}"
           data-message-created-at="${new Date(data.created_at).getTime() / 1000}"
           data-has-attachments="${data.has_attachments}">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full overflow-hidden">
            <div class="w-full h-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
              ${data.user_name[0].toUpperCase()}
            </div>
          </div>
        </div>
        <div class="chat-header ${isCurrentUser ? 'text-primary text-right' : 'text-secondary'}">
          ${data.user_name}
          <time class="text-xs opacity-50">${new Date(data.created_at).toLocaleTimeString()}</time>
        </div>
        <div class="chat-bubble ${isCurrentUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
          <div class="flex items-center justify-center min-h-[2rem]">
            ${data.content}
          </div>
        </div>
        <div class="chat-footer opacity-50 text-gray-400">
          Delivered
        </div>
      </div>
    `

    // Append the message
    messagesContainer.insertAdjacentHTML('beforeend', messageHtml)
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}