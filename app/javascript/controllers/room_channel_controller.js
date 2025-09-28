import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { roomId: Number }

  connect() {
    this.subscribeToRoom()
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  subscribeToRoom() {
    if (window.App && window.App.cable) {
      this.subscription = window.App.cable.subscriptions.create(
        { channel: "RoomChannel", id: this.roomIdValue },
        {
          connected: () => {
            // Connected to room channel
          },
          received: (data) => {
            // Process the Turbo Stream
            if (data && typeof data === 'string') {
              // Let Turbo handle the stream
              Turbo.renderStreamMessage(data)
            }
          },
          disconnected: () => {
            // Disconnected from room channel
          }
        }
      )
    } else {
      setTimeout(() => this.subscribeToRoom(), 500)
    }
  }
}
