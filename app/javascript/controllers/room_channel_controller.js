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
            
            // Handle Turbo Streams format (the proper way)
            if (data && typeof data === 'string') {
              // Let Turbo handle the stream - this preserves all styling and functionality
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