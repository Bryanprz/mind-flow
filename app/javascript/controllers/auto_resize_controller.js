import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Set initial height
    this.resize()
    
    // Look for social feed input inside the form
    const socialFeedInput = this.element.querySelector('.social-feed-input')
    if (socialFeedInput) {
      const trixEditor = socialFeedInput.querySelector('trix-editor')
      if (trixEditor) {
        // Listen to trix-editor events for content changes
        trixEditor.addEventListener('trix-change', () => this.resize())
        trixEditor.addEventListener('trix-paste', () => this.resize())
        trixEditor.addEventListener('input', () => this.resize())
        trixEditor.addEventListener('keyup', () => this.resize())
        
        // Also listen to focus events to ensure expansion
        trixEditor.addEventListener('focus', () => this.resize())
        trixEditor.addEventListener('blur', () => this.resize())
      }
    }
  }

  resize() {
    // Look for social feed input inside the form
    const socialFeedInput = this.element.querySelector('.social-feed-input')
    if (socialFeedInput) {
      // For social feed inputs, use a completely different approach
      const trixEditor = socialFeedInput.querySelector('trix-editor')
      if (trixEditor) {
        // Remove all height constraints and let it grow naturally
        trixEditor.style.height = 'auto'
        trixEditor.style.minHeight = '40px'
        trixEditor.style.maxHeight = 'none'
        trixEditor.style.overflow = 'visible'
        trixEditor.style.resize = 'none'
        
        // Also remove constraints from parent
        socialFeedInput.style.height = 'auto'
        socialFeedInput.style.minHeight = '40px'
        socialFeedInput.style.maxHeight = 'none'
        socialFeedInput.style.overflow = 'visible'
        
        // Force a reflow to get the natural height
        trixEditor.offsetHeight
        
        // Get the natural content height
        const naturalHeight = trixEditor.scrollHeight
        
        // Ensure minimum height is maintained
        const finalHeight = Math.max(naturalHeight, 40)
        
        // Set the height to the natural content height
        trixEditor.style.height = finalHeight + 'px'
        
        // Ensure the card can accommodate the growing input
        this.expandParentCard(socialFeedInput)
        
        // Force a re-render to ensure changes take effect
        setTimeout(() => {
          this.forceRerender(trixEditor)
        }, 10)
      }
    } else {
      // Original behavior for other inputs
      this.element.style.height = 'auto'
      const scrollHeight = this.element.scrollHeight
      const minHeight = parseInt(this.element.style.minHeight) || 40
      const maxHeight = parseInt(this.element.style.maxHeight) || 200
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      this.element.style.height = newHeight + 'px'
      
      if (scrollHeight > maxHeight) {
        this.element.style.overflowY = 'auto'
      } else {
        this.element.style.overflowY = 'hidden'
      }
    }
  }
  
  forceRerender(element) {
    // Force a re-render by temporarily changing and restoring a style
    const originalDisplay = element.style.display
    element.style.display = 'none'
    element.offsetHeight // Trigger reflow
    element.style.display = originalDisplay
  }
  
  expandParentCard(inputElement) {
    // Find the card and remove all height constraints
    const card = inputElement.closest('.card')
    if (card) {
      // Add expanded class for consistent behavior
      card.classList.add('expanded-card')
      
      // Remove all height constraints
      card.style.height = 'auto'
      card.style.maxHeight = 'none'
      card.style.minHeight = 'auto'
      card.style.overflow = 'visible'
      card.style.transition = 'all 0.3s ease-in-out'
      
      const cardBody = card.querySelector('.card-body')
      if (cardBody) {
        cardBody.style.height = 'auto'
        cardBody.style.maxHeight = 'none'
        cardBody.style.minHeight = 'auto'
        cardBody.style.overflow = 'visible'
      }
      
      // Use the same aggressive approach as image-preview controller
      this.overrideParentConstraintsForTextExpansion(card)
      
      // Force a re-render of the card
      setTimeout(() => {
        this.forceRerender(card)
      }, 10)
    }
    
    // Ensure page can scroll
    document.body.style.height = 'auto'
    document.documentElement.style.height = 'auto'
  }

  // Method specifically for overriding constraints to show text expansion
  overrideParentConstraintsForTextExpansion(card) {
    let currentElement = card.parentElement
    let depth = 0
    const maxDepth = 8 // More aggressive for text expansion
    
    while (currentElement && depth < maxDepth) {
      // Don't modify the header container or its parents
      if (currentElement.classList.contains('flex-shrink-0') || 
          currentElement.querySelector('h1') ||
          currentElement.querySelector('[class*="Back to"]') ||
          currentElement.id === 'messages' ||
          currentElement.classList.contains('h-screen')) {
        currentElement = currentElement.parentElement
        depth++
        continue
      }
      
      const computedStyle = window.getComputedStyle(currentElement)
      const height = computedStyle.height
      const maxHeight = computedStyle.maxHeight
      const overflow = computedStyle.overflow
      const minHeight = computedStyle.minHeight
      
      // Be more aggressive about removing constraints for text expansion
      if (height !== 'auto' || maxHeight !== 'none' || overflow === 'hidden' || overflow === 'auto' || minHeight !== '0px') {
        currentElement.style.height = 'auto'
        currentElement.style.maxHeight = 'none'
        currentElement.style.minHeight = 'auto'
        currentElement.style.overflow = 'visible'
        currentElement.style.overflowY = 'visible'
        currentElement.style.overflowX = 'visible'
        
        // Ensure flex containers can expand
        if (currentElement.classList.contains('flex-1')) {
          currentElement.style.flex = '1 1 auto'
        }
        
        currentElement.classList.add('text-expansion-override')
      }
      
      currentElement = currentElement.parentElement
      depth++
    }
  }
}