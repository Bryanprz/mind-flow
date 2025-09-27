import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Set initial height
    this.resize()
  }

  resize() {
    const element = this.element
    
    // Reset height to auto to get the correct scrollHeight
    element.style.height = 'auto'
    
    // Get the scroll height (content height)
    const scrollHeight = element.scrollHeight
    
    // Get min and max height from inline styles or defaults
    const minHeight = parseInt(element.style.minHeight) || 40
    const maxHeight = parseInt(element.style.maxHeight) || 200
    
    // Calculate new height, respecting min and max constraints
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
    
    // Apply the new height
    element.style.height = newHeight + 'px'
    
    // Show scrollbar if content exceeds max height
    if (scrollHeight > maxHeight) {
      element.style.overflowY = 'auto'
    } else {
      element.style.overflowY = 'hidden'
    }
  }
}
