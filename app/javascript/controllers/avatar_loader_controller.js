import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["avatarImage", "avatarFallback"]
  
  connect() {
    // Handle avatar loading for existing images
    this.handleAvatarLoading()
  }
  
  handleAvatarLoading() {
    const avatarImages = this.element.querySelectorAll('[data-avatar_loader_target="avatarImage"]')
    
    avatarImages.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        // Image already loaded successfully
        this.showAvatar(img)
      } else {
        // Set up error handling
        img.addEventListener('load', () => this.showAvatar(img))
        img.addEventListener('error', () => this.handleAvatarError(img))
      }
    })
  }
  
  showAvatar(img) {
    console.log('✅ Avatar loaded for', img.dataset.userName)
    img.style.display = 'block'
    const fallback = img.nextElementSibling
    if (fallback) {
      fallback.style.display = 'none'
    }
  }
  
  handleAvatarError(img) {
    if (!img.retryCount) img.retryCount = 0
    img.retryCount++
    
    console.log('❌ Avatar failed for', img.dataset.userName, '(attempt', img.retryCount + ')')
    
    if (img.retryCount < 3) {
      // Retry with a cache-busting parameter
      setTimeout(() => {
        const originalSrc = img.src.split('?')[0]
        img.src = originalSrc + '?retry=' + img.retryCount + '&t=' + Date.now()
      }, 500 * img.retryCount)
    } else {
      console.log('❌ Avatar failed after 3 attempts, showing fallback')
      this.showFallback(img)
    }
  }
  
  showFallback(img) {
    img.style.display = 'none'
    const fallback = img.nextElementSibling
    if (fallback) {
      fallback.style.display = 'flex'
    }
  }
}
