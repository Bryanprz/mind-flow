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
            
            // Handle new message format
            if (data && data.type === 'message' && data.html) {
              // Append the message HTML to the messages container
              const messagesContainer = document.getElementById('messages')
              if (messagesContainer) {
                messagesContainer.insertAdjacentHTML('beforeend', data.html)
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight
              }
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
}