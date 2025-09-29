import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    url: String, 
    title: String, 
    text: String 
  }

  async share() {
    const shareData = {
      title: this.titleValue,
      text: this.textValue,
      url: this.urlValue
    }

    try {
      // Check if the Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy URL to clipboard
        await this.fallbackShare()
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // User didn't cancel, so there was an error
        console.error('Error sharing:', error)
        await this.fallbackShare()
      }
    }
  }

  async fallbackShare() {
    try {
      await navigator.clipboard.writeText(this.urlValue)
      this.showToast('Link copied to clipboard!', 'success')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      this.showToast('Unable to share. Please copy the URL manually.', 'error')
    }
  }

  showToast(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div')
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'} fixed top-4 right-4 z-50 max-w-sm`
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${message}</span>
        <button class="btn btn-sm btn-circle btn-ghost" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `
    
    document.body.appendChild(toast)
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 3000)
  }
}
