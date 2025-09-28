import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["otherAvatar", "bubble", "currentAvatar", "tail", "timestamp"]

  connect() {
    console.log('Message position controller connected')
    this.positionMessageInternal()
  }
  
  // Also handle turbo:stream-render events for broadcasted messages
  positionMessage() {
    console.log('Positioning message via Stimulus controller')
    this.positionMessageInternal()
  }

  positionMessageInternal() {
    console.log('Available dataset:', this.element.dataset)
    const messageUserId = this.element.dataset.messageUserId
    const currentUserId = this.element.dataset.currentUserId
    
    console.log('Positioning message:', { messageUserId, currentUserId, isCurrentUser: messageUserId === currentUserId })
    
    if (messageUserId && currentUserId) {
      const isCurrentUser = messageUserId === currentUserId
      
      if (isCurrentUser) {
        // Current user's message - right side
        this.element.classList.remove('justify-start')
        this.element.classList.add('justify-end')
        
        // Hide other user's avatar, show current user's avatar
        if (this.hasOtherAvatarTarget) {
          this.otherAvatarTarget.style.display = 'none'
        }
        if (this.hasCurrentAvatarTarget) {
          this.currentAvatarTarget.style.display = 'block'
        }
        
        // Update bubble styling
        if (this.hasBubbleTarget) {
          this.bubbleTarget.classList.remove('bg-gray-200', 'text-gray-900')
          this.bubbleTarget.classList.add('bg-blue-500', 'text-white')
          
          // Update prose styling for current user
          const proseElement = this.bubbleTarget.querySelector('.prose')
          if (proseElement) {
            proseElement.classList.add('prose-invert')
          }
        }
        
        // Update tail positioning
        if (this.hasTailTarget) {
          this.tailTarget.classList.remove('left-0', 'border-r-8', 'border-r-gray-200')
          this.tailTarget.classList.add('right-0', 'border-l-8', 'border-l-blue-500')
        }
        
        // Update timestamp positioning
        if (this.hasTimestampTarget) {
          this.timestampTarget.classList.remove('justify-start')
          this.timestampTarget.classList.add('justify-end')
        }
      } else {
        // Other user's message - left side
        this.element.classList.remove('justify-end')
        this.element.classList.add('justify-start')
        
        // Show other user's avatar, hide current user's avatar
        if (this.hasOtherAvatarTarget) {
          this.otherAvatarTarget.style.display = 'block'
        }
        if (this.hasCurrentAvatarTarget) {
          this.currentAvatarTarget.style.display = 'none'
        }
        
        // Update bubble styling
        if (this.hasBubbleTarget) {
          this.bubbleTarget.classList.remove('bg-blue-500', 'text-white')
          this.bubbleTarget.classList.add('bg-gray-200', 'text-gray-900')
          
          // Update prose styling for other users
          const proseElement = this.bubbleTarget.querySelector('.prose')
          if (proseElement) {
            proseElement.classList.remove('prose-invert')
          }
        }
        
        // Update tail positioning
        if (this.hasTailTarget) {
          this.tailTarget.classList.remove('right-0', 'border-l-8', 'border-l-blue-500')
          this.tailTarget.classList.add('left-0', 'border-r-8', 'border-r-gray-200')
        }
        
        // Update timestamp positioning
        if (this.hasTimestampTarget) {
          this.timestampTarget.classList.remove('justify-end')
          this.timestampTarget.classList.add('justify-start')
        }
      }
    }
  }
}
