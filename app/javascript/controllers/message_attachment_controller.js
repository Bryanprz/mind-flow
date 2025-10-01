import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Minimal attachment handling - just for refresh functionality
    if (this.element.dataset.autoRefresh === 'true') {
      setTimeout(() => {
        this.refreshMessage()
      }, 2000)
    }
  }

  refreshMessage() {
    const messageId = this.element.dataset.messageId
    const roomId = this.getRoomId()
    
    if (messageId && roomId) {
      fetch(`/rooms/${roomId}/messages/${messageId}/refresh`, {
        method: 'GET',
        headers: {
          'Accept': 'text/vnd.turbo-stream.html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.text())
      .then(html => Turbo.renderStreamMessage(html))
      .catch(error => console.log('Refresh failed:', error))
    }
  }

  getRoomId() {
    const pathMatch = window.location.pathname.match(/\/rooms\/(\d+)/)
    return pathMatch ? pathMatch[1] : null
  }
}