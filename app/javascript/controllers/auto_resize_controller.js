import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Set initial height
    this.resize()
    
    // For social feed inputs, also listen to trix-editor events
    if (this.element.classList.contains('social-feed-input')) {
      const trixEditor = this.element.querySelector('trix-editor')
      if (trixEditor) {
        // Listen to trix-editor events for content changes
        trixEditor.addEventListener('trix-change', () => this.resize())
        trixEditor.addEventListener('trix-paste', () => this.resize())
        trixEditor.addEventListener('input', () => this.resize())
        trixEditor.addEventListener('keyup', () => this.resize())
      }
    }
  }

  resize() {
    const element = this.element
    
    // Check if this is a social feed input
    const isSocialFeedInput = element.classList.contains('social-feed-input')
    
    if (isSocialFeedInput) {
      // For social feed inputs, use a completely different approach
      const trixEditor = element.querySelector('trix-editor')
      if (trixEditor) {
        // Remove all height constraints and let it grow naturally
        trixEditor.style.height = 'auto'
        trixEditor.style.minHeight = '40px'
        trixEditor.style.maxHeight = 'none'
        trixEditor.style.overflow = 'visible'
        trixEditor.style.resize = 'none'
        
        // Also remove constraints from parent
        element.style.height = 'auto'
        element.style.minHeight = '40px'
        element.style.maxHeight = 'none'
        element.style.overflow = 'visible'
        
        // Force a reflow to get the natural height
        trixEditor.offsetHeight
        
        // Get the natural content height
        const naturalHeight = trixEditor.scrollHeight
        
        // Set the height to the natural content height
        trixEditor.style.height = naturalHeight + 'px'
        
        // Ensure the card can accommodate the growing input
        this.expandParentCard(element)
      }
    } else {
      // Original behavior for other inputs
      element.style.height = 'auto'
      const scrollHeight = element.scrollHeight
      const minHeight = parseInt(element.style.minHeight) || 40
      const maxHeight = parseInt(element.style.maxHeight) || 200
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      element.style.height = newHeight + 'px'
      
      if (scrollHeight > maxHeight) {
        element.style.overflowY = 'auto'
      } else {
        element.style.overflowY = 'hidden'
      }
    }
  }
  
  expandParentCard(inputElement) {
    // Find the card and remove all height constraints
    const card = inputElement.closest('.card')
    if (card) {
      card.style.height = 'auto'
      card.style.maxHeight = 'none'
      card.style.overflow = 'visible'
      
      const cardBody = card.querySelector('.card-body')
      if (cardBody) {
        cardBody.style.height = 'auto'
        cardBody.style.maxHeight = 'none'
        cardBody.style.overflow = 'visible'
      }
    }
    
    // Ensure page can scroll
    document.body.style.height = 'auto'
    document.documentElement.style.height = 'auto'
  }
}
