import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-preview"
export default class extends Controller {
  static targets = ["fileInput", "preview", "form", "inputField", "previewContainer", "previewGrid", "card", "submitButton", "sendIcon", "sendSpinner", "mediaButton"]
  static values = { formId: String }

  connect() {
    console.log('Image preview controller connected')
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
    console.log('handleFormSubmit exists:', typeof this.handleFormSubmit)
    this.boundHandleFileSelect = this.handleFileSelect.bind(this)
    this.boundHandleFormSubmit = this.handleFormSubmit.bind(this)
    this.isFileInputClicking = false // Flag to prevent recursive clicks
    this.processingFiles = false // Flag to prevent double processing
    this.isSubmitting = false // Flag to prevent double submission
    this.setupFileInput()
    this.setupDragAndDrop()
    this.setupFormSubmission()
  }

  handleFileClick(event) {
    // Prevent recursive calls from file input clicks
    if (event.target.type === 'file' || event.target === this.fileInputTarget) {
      return
    }
    
    // Prevent double processing
    if (this.processingFiles) {
      return
    }
    
    // Prevent event bubbling to avoid multiple triggers
    event.stopPropagation()
    event.preventDefault()
    
    // Trigger the hidden file input when the icon is clicked
    if (this.hasFileInputTarget) {
      this.fileInputTarget.click()
    }
  }

  disconnect() {
    if (this.hasFileInputTarget && this.boundHandleFileSelect) {
      this.fileInputTarget.removeEventListener('change', this.boundHandleFileSelect)
    }
    
    // Clean up drag and drop event listeners
    const mediaUploadArea = this.element.querySelector('.form-control')
    if (mediaUploadArea) {
      if (this.boundHandleDragOver) {
        mediaUploadArea.removeEventListener('dragover', this.boundHandleDragOver)
      }
      if (this.boundHandleDragLeave) {
        mediaUploadArea.removeEventListener('dragleave', this.boundHandleDragLeave)
      }
      if (this.boundHandleDrop) {
        mediaUploadArea.removeEventListener('drop', this.boundHandleDrop)
      }
    }
    
    // Clean up Trix editor drag and drop event listeners
    const trixEditor = this.element.querySelector('trix-editor')
    if (trixEditor) {
      if (this.boundTrixDragOver) {
        trixEditor.removeEventListener('dragover', this.boundTrixDragOver, true)
      }
      if (this.boundTrixDragLeave) {
        trixEditor.removeEventListener('dragleave', this.boundTrixDragLeave, true)
      }
      if (this.boundTrixDrop) {
        trixEditor.removeEventListener('drop', this.boundTrixDrop, true)
      }
    }
    
    // Clean up scroll maintenance
    if (this.scrollMaintenanceInterval) {
      clearInterval(this.scrollMaintenanceInterval)
    }
    
    // Clean up scroll monitor and prevention handler
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      if (this.scrollMonitor) {
        messagesContainer.removeEventListener('scroll', this.scrollMonitor)
      }
      if (this.scrollPreventionHandler) {
        messagesContainer.removeEventListener('scroll', this.scrollPreventionHandler)
      }
    }
  }

  setupFileInput() {
    if (this.hasFileInputTarget) {
      // Remove any existing listeners to avoid duplicates
      this.fileInputTarget.removeEventListener('change', this.boundHandleFileSelect)
      
      // Add a small delay to ensure the element is ready
      setTimeout(() => {
        if (this.hasFileInputTarget) {
          this.fileInputTarget.addEventListener('change', this.boundHandleFileSelect)
        } else {
        }
      }, 100) // Increased delay for turbo stream updates
    } else {
    }
  }

  setupDragAndDrop() {
    // Add drag and drop to the media upload area specifically
    const mediaUploadArea = this.element.querySelector('.form-control')
    if (mediaUploadArea) {
      // Store bound functions to avoid multiple bindings
      this.boundHandleDragOver = this.handleDragOver.bind(this)
      this.boundHandleDragLeave = this.handleDragLeave.bind(this)
      this.boundHandleDrop = this.handleDrop.bind(this)
      
      mediaUploadArea.addEventListener('dragover', this.boundHandleDragOver)
      mediaUploadArea.addEventListener('dragleave', this.boundHandleDragLeave)
      mediaUploadArea.addEventListener('drop', this.boundHandleDrop)
    }
    
    // ALSO add drag and drop to the Trix editor to prevent inline image insertion
    const trixEditor = this.element.querySelector('trix-editor')
    if (trixEditor) {
      // Store bound functions for Trix editor
      this.boundTrixDragOver = this.handleTrixDragOver.bind(this)
      this.boundTrixDragLeave = this.handleTrixDragLeave.bind(this)
      this.boundTrixDrop = this.handleTrixDrop.bind(this)
      
      // Use capture phase to intercept before Trix processes the events
      trixEditor.addEventListener('dragover', this.boundTrixDragOver, true)
      trixEditor.addEventListener('dragleave', this.boundTrixDragLeave, true)
      trixEditor.addEventListener('drop', this.boundTrixDrop, true)
    }
  }

  handleDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  handleDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  handleDrop(event) {
    event.preventDefault()
    event.stopPropagation() // Prevent event bubbling to other forms
    event.currentTarget.classList.remove('border-primary', 'bg-primary/5')
    
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      this.handleFiles(files)
    }
  }

  // Trix-specific drag and drop handlers
  handleTrixDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation() // Prevent any other handlers
    // Show visual feedback that we can accept the drop
    event.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
    event.currentTarget.style.border = '2px dashed #3b82f6'
    return false // Additional prevention
  }

  handleTrixDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation() // Prevent any other handlers
    // Remove visual feedback
    event.currentTarget.style.backgroundColor = ''
    event.currentTarget.style.border = ''
    return false // Additional prevention
  }

  handleTrixDrop(event) {
    event.preventDefault()
    event.stopPropagation() // Prevent Trix from handling the drop
    event.stopImmediatePropagation() // Prevent any other handlers
    
    // Remove visual feedback
    event.currentTarget.style.backgroundColor = ''
    event.currentTarget.style.border = ''
    
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      // Route through the same handler as media icon clicks
      this.handleFiles(files)
    }
    
    return false // Additional prevention
  }

  handleFiles(files) {
    // Prevent double processing
    if (this.processingFiles) {
      return
    }
    
    this.processingFiles = true
    
    // Convert FileList to Array and replace existing files
    const fileArray = Array.from(files)
    const dt = new DataTransfer()
    fileArray.forEach(file => dt.items.add(file))
    
    if (this.hasFileInputTarget) {
      // Clear existing files and add new ones
      this.fileInputTarget.files = dt.files
      this.showImagePreviews(files)
      
      // Debug: Log which form is handling files
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      this.processingFiles = false
    }, 200)
  }

  handleFileSelect(event) {
    // Prevent double processing
    if (this.processingFiles) {
      return
    }
    
    this.processingFiles = true
    
    const files = event.target.files
    if (files && files.length > 0) {
      this.showImagePreviews(files)
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      this.processingFiles = false
    }, 200)
  }

  showImagePreviews(files) {
    // Store current scroll position before making any changes
    this.storeScrollPosition()
    
    // Lock scroll position immediately
    this.lockScrollPosition()
    
    // Clear existing previews in this specific form only
    if (this.hasPreviewGridTarget) {
      this.previewGridTarget.innerHTML = ''
    }

    // Show preview container for this specific form only
    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.remove('hidden')
    }

    // Show each selected image in this specific form
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        this.createImagePreview(file, index)
      }
    })

    // Expand the input field for this specific form
    this.expandInputField()
    
    // Expand the card to accommodate images for this specific form
    this.expandCard()
    
    // Continuously maintain scroll position
    this.continuousScrollMaintenance()
  }

  createPreviewContainer() {
    const previewContainer = document.createElement('div')
    previewContainer.setAttribute('data-image-preview-target', 'preview')
    previewContainer.className = 'image-preview-container mt-2 space-y-2'
    
    // Insert after the input field
    const inputContainer = this.inputFieldTarget.closest('.flex-1')
    inputContainer.appendChild(previewContainer)
  }

  createImagePreview(file, index) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewItem = document.createElement('div')
      previewItem.className = 'relative preview-item'
      
      const img = document.createElement('img')
      img.src = e.target.result
      img.className = 'w-20 h-20 object-cover rounded-lg border border-primary'
      img.alt = `Preview ${index + 1}`
      
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
      removeBtn.innerHTML = '×'
      removeBtn.onclick = () => this.removeImagePreview(previewItem, index)
      
      previewItem.appendChild(img)
      previewItem.appendChild(removeBtn)
      
      if (this.hasPreviewGridTarget) {
        this.previewGridTarget.appendChild(previewItem)
      }
      
      // Maintain scroll position at bottom when image preview is added
      this.maintainScrollPosition()
    }
    reader.readAsDataURL(file)
  }

  removeImagePreview(previewItem, index) {
    previewItem.remove()
    
    // Update the file input to remove the file
    if (this.hasFileInputTarget) {
      const dt = new DataTransfer()
      const files = Array.from(this.fileInputTarget.files)
      files.splice(index, 1)
      files.forEach(file => dt.items.add(file))
      this.fileInputTarget.files = dt.files
    }

    // If no more images, hide the preview container
    if (this.hasPreviewGridTarget && this.previewGridTarget.children.length === 0) {
      if (this.hasPreviewContainerTarget) {
        this.previewContainerTarget.classList.add('hidden')
      }
      this.collapseInputField()
    }
    
    // Maintain scroll position when image preview is removed
    this.maintainScrollPosition()
  }
  
  maintainScrollPosition() {
    // Find the scroll-to controller in the messages container
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      const scrollToController = messagesContainer.closest('[data-controller*="scroll-to"]')
      if (scrollToController) {
        // Use the scroll-to controller's method to maintain bottom scroll
        const controller = this.application.getControllerForElementAndIdentifier(scrollToController, 'scroll-to')
        if (controller && controller.handleImagePreviewAddition) {
          controller.handleImagePreviewAddition()
        }
      }
    }
  }

  expandInputField() {
    if (this.hasInputFieldTarget) {
      const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
      if (textarea) {
        textarea.classList.add('expanded')
      }
      
      // Also expand the card to accommodate growing input
      this.expandCard()
    }
  }

  collapseInputField() {
    if (this.hasInputFieldTarget) {
      const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
      if (textarea) {
        textarea.classList.remove('expanded')
        
        // Force remove any extra borders that might appear after form submission
        const trixEditor = textarea.querySelector('trix-editor')
        if (trixEditor) {
          trixEditor.style.border = 'none'
          trixEditor.style.boxShadow = 'none'
          trixEditor.style.outline = 'none'
        }
      }
    }
    
    // Collapse the card
    this.collapseCard()
  }

  expandCard() {
    if (this.hasCardTarget) {
      
      // Check if we're in a room/chat context
      const isRoomContext = this.element.closest('#messages') || 
                           this.element.closest('.room') ||
                           this.element.closest('[data-controller*="room-channel"]')
      
      // Add CSS class for expansion
      this.cardTarget.classList.add('expanded-card')
      
      if (isRoomContext) {
        // For room context, only expand the preview container, not the entire card
        this.cardTarget.style.transition = 'all 0.3s ease-in-out'
        
        // Only expand the preview container, not the card itself
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
        }
        
        // Prevent scroll to top by maintaining current scroll position
        this.restoreScrollPosition()
      } else {
        // Check if this is a social feed card - if so, don't apply conflicting styles
        const isSocialFeedCard = this.cardTarget.classList.contains('social-feed-card')
        
        // For non-room, use balanced expansion that shows image previews but preserves scroll
        this.cardTarget.style.transition = 'all 0.3s ease-in-out'
        
        if (!isSocialFeedCard) {
          // Expand the card to accommodate image previews (only for non-social-feed cards)
          this.cardTarget.style.overflow = 'visible'
          this.cardTarget.style.maxHeight = 'none'
          
          // Expand the card body to accommodate images (only for non-social-feed cards)
          const cardBody = this.cardTarget.querySelector('.card-body')
          if (cardBody) {
            cardBody.style.height = 'auto'
            cardBody.style.maxHeight = 'none'
            cardBody.style.overflow = 'visible'
          }
        } else {
          // For social feed cards, only set overflow to visible, let CSS handle the rest
          this.cardTarget.style.overflow = 'visible'
        }
        
        // Ensure preview container is fully visible
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
          this.previewContainerTarget.style.minHeight = '80px' // Ensure enough space for images
        }
        
        // Override parent constraints more aggressively for image preview visibility
        this.overrideParentConstraintsForImagePreview()
        
      }
      
    } else {
      // Fallback: try to find the card element manually
      const cardElement = this.element.querySelector('[data-image-preview-target="card"]')
      if (cardElement) {
        cardElement.classList.add('expanded-card')
        cardElement.style.transition = 'all 0.3s ease-in-out'
        
        // Only expand the preview container
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
        }
      } else {
      }
    }
  }

  collapseCard() {
    if (this.hasCardTarget) {
      // Remove CSS class
      this.cardTarget.classList.remove('expanded-card')
      
      // Reset card styling
      this.cardTarget.style.transition = ''
      this.cardTarget.style.overflow = ''
      this.cardTarget.style.height = ''
      this.cardTarget.style.maxHeight = ''
      this.cardTarget.style.minHeight = ''
      
      // Reset card-body styling
      const cardBody = this.cardTarget.querySelector('.card-body')
      if (cardBody) {
        cardBody.style.height = ''
        cardBody.style.maxHeight = ''
        cardBody.style.overflow = ''
      }
      
      // Reset preview container styling
      if (this.hasPreviewContainerTarget) {
        this.previewContainerTarget.style.display = ''
        this.previewContainerTarget.style.height = ''
        this.previewContainerTarget.style.maxHeight = ''
        this.previewContainerTarget.style.overflow = ''
      }
    }
  }

  overrideParentConstraints() {
    // Check if we're in a room/chat context - be very conservative
    const isRoomContext = this.element.closest('#messages') || 
                         this.element.closest('.room') ||
                         this.element.closest('[data-controller*="room-channel"]')
    
    if (isRoomContext) {
      // In room context, only override the immediate parent of the card
      // Don't touch the messages container or its parents
      let currentElement = this.cardTarget.parentElement
      let depth = 0
      const maxDepth = 2 // Very limited depth for room context
      
      while (currentElement && depth < maxDepth) {
        // Don't modify the messages container, header, or its parents
        if (currentElement.id === 'messages' || 
            currentElement.classList.contains('h-full') ||
            currentElement.classList.contains('overflow-y-auto') ||
            currentElement.classList.contains('flex-shrink-0') ||
            currentElement.querySelector('h1') ||
            currentElement.querySelector('[class*="Back to"]')) {
          break
        }
        
        const computedStyle = window.getComputedStyle(currentElement)
        const maxHeight = computedStyle.maxHeight
        
        // Only override if it's clearly constraining the preview and not critical for layout
        if (maxHeight !== 'none' && maxHeight !== '100%' && !currentElement.classList.contains('flex-1')) {
          currentElement.style.maxHeight = 'none'
          currentElement.style.overflow = 'visible'
          currentElement.classList.add('image-preview-expanded')
        }
        
        currentElement = currentElement.parentElement
        depth++
      }
    } else {
      // Non-room context - use original approach
      let currentElement = this.cardTarget.parentElement
      let depth = 0
      const maxDepth = 8
      
      while (currentElement && depth < maxDepth) {
        // Don't modify header containers
        if (currentElement.classList.contains('flex-shrink-0') || 
            currentElement.querySelector('h1') ||
            currentElement.querySelector('[class*="Back to"]')) {
          currentElement = currentElement.parentElement
          depth++
          continue
        }
        
        const computedStyle = window.getComputedStyle(currentElement)
        const height = computedStyle.height
        const maxHeight = computedStyle.maxHeight
        const overflow = computedStyle.overflow
        const minHeight = computedStyle.minHeight
        
        if (height !== 'auto' || maxHeight !== 'none' || overflow === 'hidden' || overflow === 'auto' || minHeight !== '0px') {
          
          currentElement.style.height = 'auto'
          currentElement.style.maxHeight = 'none'
          currentElement.style.minHeight = 'auto'
          currentElement.style.overflow = 'visible'
          currentElement.style.overflowY = 'visible'
          currentElement.style.overflowX = 'visible'
          
          if (currentElement.classList.contains('flex-1')) {
            currentElement.style.flex = 'none'
          }
          
          currentElement.classList.add('image-preview-expanded')
        }
        
        currentElement = currentElement.parentElement
        depth++
      }
    }
  }
  
  // Method specifically for overriding constraints to show image previews
  overrideParentConstraintsForImagePreview() {
    let currentElement = this.cardTarget.parentElement
    let depth = 0
    const maxDepth = 6 // More aggressive for image preview visibility
    
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
      
      // Be more aggressive about removing constraints for image preview visibility
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
        
        currentElement.classList.add('image-preview-expanded')
      }
      
      currentElement = currentElement.parentElement
      depth++
    }
  }

  // Method to store current scroll position
  storeScrollPosition() {
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      this.storedScrollTop = messagesContainer.scrollTop
      this.storedScrollHeight = messagesContainer.scrollHeight
      this.storedClientHeight = messagesContainer.clientHeight
      
      // Create anchor element at the bottom of messages
      this.createScrollAnchor()
      
      // Temporarily disable auto-scrolling in the scroll-to controller
      const scrollToController = this.getScrollToController()
      if (scrollToController) {
        scrollToController.disableAutoScroll()
        // Store reference for later re-enabling
        this.scrollToController = scrollToController
      }
      
      // Add scroll event listener to monitor what's happening
      this.scrollMonitor = (event) => {
        // Monitor scroll events
      }
      messagesContainer.addEventListener('scroll', this.scrollMonitor)
    }
  }
  
  // Method to create a scroll anchor at the image preview
  createScrollAnchor() {
    // Remove existing anchor if any
    this.removeScrollAnchor()
    
    // Create anchor element and place it at the image preview container
    this.scrollAnchor = document.createElement('div')
    this.scrollAnchor.id = 'scroll-anchor-' + Date.now()
    this.scrollAnchor.style.height = '1px'
    this.scrollAnchor.style.width = '1px'
    this.scrollAnchor.style.visibility = 'hidden'
    
    // Add anchor to the preview container if it exists, otherwise to the card
    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.appendChild(this.scrollAnchor)
    } else if (this.hasCardTarget) {
      this.cardTarget.appendChild(this.scrollAnchor)
    } else {
      // Fallback to messages container
      const messagesContainer = document.getElementById('messages')
      if (messagesContainer) {
        messagesContainer.appendChild(this.scrollAnchor)
      }
    }
  }
  
  // Method to remove scroll anchor
  removeScrollAnchor() {
    if (this.scrollAnchor && this.scrollAnchor.parentNode) {
      this.scrollAnchor.parentNode.removeChild(this.scrollAnchor)
      this.scrollAnchor = null
    }
  }

  // Method to restore scroll position using anchor
  restoreScrollPosition() {
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer && this.storedScrollTop !== undefined) {
      // Use requestAnimationFrame to ensure DOM changes are complete
      requestAnimationFrame(() => {
        const currentScrollHeight = messagesContainer.scrollHeight
        const heightDifference = currentScrollHeight - this.storedScrollHeight
        
        // If we were at the bottom before, use anchor to scroll to bottom
        const bottomThreshold = 50 // pixels from bottom
        const wasAtBottom = this.storedScrollTop >= (this.storedScrollHeight - this.storedClientHeight - bottomThreshold)
        
        if (wasAtBottom) {
          // User was at the bottom - scroll to anchor
          this.scrollToAnchor()
        } else {
          // User was scrolled up, maintain their relative position
          const newScrollTop = this.storedScrollTop + heightDifference
          const maxScrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight
          const finalScrollTop = Math.min(newScrollTop, maxScrollTop)
          
          messagesContainer.scrollTop = finalScrollTop
        }
        
        // Re-enable auto-scrolling after a delay
        setTimeout(() => {
          if (this.scrollToController) {
            this.scrollToController.enableAutoScroll()
            this.scrollToController = null
          }
          
          // Remove scroll monitor and anchor
          if (this.scrollMonitor) {
            messagesContainer.removeEventListener('scroll', this.scrollMonitor)
            this.scrollMonitor = null
          }
          
          // Remove anchor after use
          this.removeScrollAnchor()
        }, 1000)
      })
    }
  }
  
  // Method to scroll to the anchor
  scrollToAnchor() {
    if (this.scrollAnchor) {
      this.scrollAnchor.scrollIntoView({ 
        behavior: 'auto', // Remove smooth animation
        block: 'start', // Scroll to show the image preview from the top
        inline: 'nearest'
      })
    } else {
      // Fallback to scroll to bottom
      const messagesContainer = document.getElementById('messages')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }

  // Method to maintain scroll position when expanding card in room context
  maintainScrollPosition() {
    // Store current scroll position
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      const currentScrollTop = messagesContainer.scrollTop
      const currentScrollHeight = messagesContainer.scrollHeight
      
      // Use requestAnimationFrame to maintain scroll position after DOM changes
      requestAnimationFrame(() => {
        // Only adjust scroll if the content height changed
        if (messagesContainer.scrollHeight > currentScrollHeight) {
          const heightDifference = messagesContainer.scrollHeight - currentScrollHeight
          messagesContainer.scrollTop = currentScrollTop + heightDifference
        }
      })
    }
  }

  // Method to restore layout when scroll area is broken
  restoreLayoutForScroll() {
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer) return
    
    // Find and reset any parent containers that might be causing layout issues
    let currentElement = messagesContainer.parentElement
    let depth = 0
    const maxDepth = 5
    
    while (currentElement && depth < maxDepth) {
      // Reset any problematic styles that might be preventing proper height
      if (currentElement.classList.contains('image-preview-expanded')) {
        currentElement.style.height = ''
        currentElement.style.maxHeight = ''
        currentElement.style.minHeight = ''
        currentElement.style.overflow = ''
        currentElement.style.overflowY = ''
        currentElement.style.overflowX = ''
        
        // Remove the expanded class temporarily
        currentElement.classList.remove('image-preview-expanded')
        
        // Re-add it with more conservative settings
        setTimeout(() => {
          currentElement.classList.add('image-preview-expanded')
          currentElement.style.maxHeight = 'none'
          currentElement.style.overflow = 'visible'
        }, 50)
      }
      
      currentElement = currentElement.parentElement
      depth++
    }
  }
  
  // Method to force messages container to have proper height
  forceMessagesContainerHeight() {
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer) return
    
    // Force the messages container to have proper height
    messagesContainer.style.height = '100%'
    messagesContainer.style.maxHeight = 'none'
    messagesContainer.style.overflow = 'auto'
    messagesContainer.style.overflowY = 'auto'
    
    // Also ensure parent containers have proper height
    let currentElement = messagesContainer.parentElement
    let depth = 0
    const maxDepth = 3
    
    while (currentElement && depth < maxDepth) {
      if (currentElement.classList.contains('flex-1') || currentElement.classList.contains('h-full')) {
        currentElement.style.height = '100%'
        currentElement.style.maxHeight = 'none'
        currentElement.style.overflow = 'hidden'
      }
      currentElement = currentElement.parentElement
      depth++
    }
  }

  // Method to lock scroll position immediately
  lockScrollPosition() {
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer || !this.storedScrollTop) return
    
    // Check if user was at bottom
    const wasAtBottom = this.storedScrollTop >= (this.storedScrollHeight - this.storedClientHeight - 50)
    
    if (wasAtBottom) {
      
      // Immediately set scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight
      
      // Prevent any scroll events from changing position
      this.scrollLockActive = true
      
      // Add scroll event listener to prevent unwanted scrolling
      this.scrollPreventionHandler = (event) => {
        if (this.scrollLockActive) {
          event.preventDefault()
          event.stopPropagation()
          messagesContainer.scrollTop = messagesContainer.scrollHeight
          return false
        }
      }
      
      messagesContainer.addEventListener('scroll', this.scrollPreventionHandler, { passive: false })
    }
  }
  
  // Method for continuous scroll position maintenance using anchor
  continuousScrollMaintenance() {
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer || !this.storedScrollTop) return
    
    // Check if user was at bottom
    const wasAtBottom = this.storedScrollTop >= (this.storedScrollHeight - this.storedClientHeight - 50)
    
    if (wasAtBottom) {
      
      // Scroll to anchor every 100ms for 1 second
      let attempts = 0
      const maxAttempts = 10 // 1 second at 100ms intervals
      
      this.scrollMaintenanceInterval = setInterval(() => {
        attempts++
        this.scrollToAnchor()
        
        if (attempts >= maxAttempts) {
          clearInterval(this.scrollMaintenanceInterval)
          
          // Remove scroll prevention handler
          if (this.scrollPreventionHandler) {
            messagesContainer.removeEventListener('scroll', this.scrollPreventionHandler)
            this.scrollPreventionHandler = null
          }
          
          // Re-enable auto-scrolling
          setTimeout(() => {
            if (this.scrollToController) {
              this.scrollToController.enableAutoScroll()
              this.scrollToController = null
            }
            this.scrollLockActive = false
          }, 500)
        }
      }, 100)
    }
  }

  // Method to get the scroll-to controller instance
  getScrollToController() {
    const messagesContainer = document.getElementById('messages')
    if (messagesContainer) {
      // Get the scroll-to controller from the messages container
      const application = this.application
      if (application) {
        const controller = application.getControllerForElementAndIdentifier(messagesContainer, 'scroll-to')
        return controller
      }
    }
    return null
  }

  // Method to be called when input content changes
  handleInputGrowth() {
    // Expand the card to accommodate growing input
    this.expandCard()
    
    // Also ensure the card stays expanded
    if (this.hasCardTarget) {
      this.cardTarget.classList.add('expanded-card')
      
      // Remove any height constraints from the card
      this.cardTarget.style.maxHeight = 'none'
      this.cardTarget.style.height = 'auto'
      this.cardTarget.style.overflow = 'visible'
      
      // Also ensure the card body can expand
      const cardBody = this.cardTarget.querySelector('.card-body')
      if (cardBody) {
        cardBody.style.maxHeight = 'none'
        cardBody.style.height = 'auto'
        cardBody.style.overflow = 'visible'
      }
    }
    
    // Ensure the page can scroll to accommodate the growing content
    document.body.style.height = 'auto'
    document.documentElement.style.height = 'auto'
  }

  // Method to clear all image previews and reset the form
  clearPreviews() {
    // Clear the file input
    if (this.hasFileInputTarget) {
      this.fileInputTarget.value = ''
    }
    
    // Clear the preview container
    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.add('hidden')
    }
    
    // Clear the preview grid
    if (this.hasPreviewGridTarget) {
      this.previewGridTarget.innerHTML = ''
    }
    
    // Clear any existing previews
    if (this.hasPreviewTarget) {
      this.previewTarget.innerHTML = ''
    }
    
    // Reset the form if it exists
    const form = this.element.closest('form')
    if (form) {
      form.reset()
    }
    
    // Clear any drag and drop state
    this.clearDragAndDropState()
  }

  // Method to clear drag and drop visual state
  clearDragAndDropState() {
    const mediaUploadArea = this.element.querySelector('.form-control')
    if (mediaUploadArea) {
      mediaUploadArea.classList.remove('drag-over')
    }
  }

  setupFormSubmission() {
    // Listen for form submission to show loading states
    if (this.hasFormTarget) {
      this.formTarget.addEventListener('submit', (event) => {
        this.handleFormSubmission(event)
      })
    } else {
      // Try to find form by looking for the form element
      const form = this.element.querySelector('form')
      if (form) {
        form.addEventListener('submit', (event) => {
          this.handleFormSubmission(event)
        })
      }
    }
    
    // Also listen for turbo:submit-start event as a backup
    this.element.addEventListener('turbo:submit-start', (event) => {
      this.handleFormSubmission(event)
    })
    
    // Also listen for submit button clicks as a backup
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.addEventListener('click', (event) => {
        // Small delay to allow form submission to start
        setTimeout(() => {
          this.handleFormSubmission(event)
        }, 10)
      })
    }
  }

  handleFormSubmission(event) {
    console.log('handleFormSubmission called, hasAttachments:', this.hasAttachments())
    // Only show loading states if there are images attached
    if (this.hasAttachments()) {
      this.showLoadingStates()
      this.isSubmitting = true
    }
  }

  hasAttachments() {
    return this.hasPreviewGridTarget && this.previewGridTarget.children.length > 0
  }

  showLoadingStates() {
    // Disable send button and show spinner
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.style.pointerEvents = 'none'
      this.submitButtonTarget.style.opacity = '0.5'
    }
    if (this.hasSendIconTarget) {
      this.sendIconTarget.classList.add('hidden')
    }
    if (this.hasSendSpinnerTarget) {
      this.sendSpinnerTarget.classList.remove('hidden')
    }

    // Disable media button
    if (this.hasMediaButtonTarget) {
      this.mediaButtonTarget.style.pointerEvents = 'none'
      this.mediaButtonTarget.style.opacity = '0.5'
    }

    // Add loading overlay to image previews
    this.addLoadingOverlaysToPreviews()
  }

  hideLoadingStates() {
    // Re-enable send button and hide spinner
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.style.pointerEvents = ''
      this.submitButtonTarget.style.opacity = ''
    }
    if (this.hasSendIconTarget) {
      this.sendIconTarget.classList.remove('hidden')
    }
    if (this.hasSendSpinnerTarget) {
      this.sendSpinnerTarget.classList.add('hidden')
    }

    // Re-enable media button
    if (this.hasMediaButtonTarget) {
      this.mediaButtonTarget.style.pointerEvents = ''
      this.mediaButtonTarget.style.opacity = ''
    }

    // Remove loading overlays from image previews
    this.removeLoadingOverlaysFromPreviews()
  }

  addLoadingOverlaysToPreviews() {
    if (this.hasPreviewGridTarget) {
      const previewItems = this.previewGridTarget.querySelectorAll('.preview-item')
      previewItems.forEach(item => {
        // Add loading overlay if not already present
        if (!item.querySelector('.loading-overlay')) {
          const overlay = document.createElement('div')
          overlay.className = 'loading-overlay absolute inset-0 bg-gray-500 bg-opacity-70 flex items-center justify-center rounded-lg'
          overlay.innerHTML = `
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary opacity-75" style="animation-direction: reverse;"></div>
          `
          item.style.position = 'relative'
          item.appendChild(overlay)
          
          // Disable and gray out the remove button
          const removeBtn = item.querySelector('button')
          if (removeBtn) {
            removeBtn.disabled = true
            removeBtn.style.opacity = '0.5'
            removeBtn.style.pointerEvents = 'none'
            removeBtn.classList.remove('bg-red-500', 'hover:bg-red-600')
            removeBtn.classList.add('bg-gray-400', 'text-gray-600')
          }
        }
      })
    }
  }

  removeLoadingOverlaysFromPreviews() {
    if (this.hasPreviewGridTarget) {
      const overlays = this.previewGridTarget.querySelectorAll('.loading-overlay')
      overlays.forEach(overlay => overlay.remove())
      
      // Re-enable remove buttons
      const previewItems = this.previewGridTarget.querySelectorAll('.preview-item')
      previewItems.forEach(item => {
        const removeBtn = item.querySelector('button')
        if (removeBtn) {
          removeBtn.disabled = false
          removeBtn.style.opacity = ''
          removeBtn.style.pointerEvents = ''
          removeBtn.classList.remove('bg-gray-400', 'text-gray-600')
          removeBtn.classList.add('bg-red-500', 'hover:bg-red-600')
        }
      })
    }
  }

  handleFormSubmit(event) {
    console.log('handleFormSubmit called', event)
    
    try {
      if (event.detail && event.detail.success !== false) {
        this.clearPreviews()
        this.collapseCard()
        this.collapseInputField()
        this.resetTrixEditorStyling()
        
        this.storedScrollTop = null
        this.storedScrollHeight = null
        this.storedClientHeight = null
        
        this.removeScrollAnchor()
        
        if (this.scrollMaintenanceInterval) {
          clearInterval(this.scrollMaintenanceInterval)
          this.scrollMaintenanceInterval = null
        }
        
        if (this.scrollToController) {
          this.scrollToController.enableAutoScroll()
          this.scrollToController = null
        }
        
        this.processingFiles = false
        this.scrollLockActive = false
        this.isSubmitting = false
        
        // Hide loading states after successful submission
        this.hideLoadingStates()
      }
    } catch (error) {
      console.error('Error in handleFormSubmit:', error)
      // Hide loading states on error
      this.hideLoadingStates()
      this.isSubmitting = false
    }
  }

  // Test method to verify controller is working
  testMethod() {
    console.log('Test method called - controller is working')
    return true
  }

  // Simple form submission handler similar to chat controller
  clearForm() {
    console.log('clearForm called')
    try {
      this.clearPreviews()
      this.collapseInputField()
      this.resetTrixEditorStyling()
      console.log('Form cleared successfully')
      
      // Debug: Check if border was actually removed
      if (this.hasInputFieldTarget) {
        const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
        if (textarea) {
          const computedStyle = window.getComputedStyle(textarea)
          console.log('Textarea border after clear:', computedStyle.border)
          console.log('Textarea classes after clear:', textarea.className)
        }
      }
    } catch (error) {
      console.error('Error in clearForm:', error)
    }
  }
  
  resetTrixEditorStyling() {
    // Force reset any Trix editor styling that might cause extra borders
    if (this.hasInputFieldTarget) {
      const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
      if (textarea) {
        const trixEditor = textarea.querySelector('trix-editor')
        if (trixEditor) {
          // Force remove any borders, shadows, or outlines
          trixEditor.style.border = 'none'
          trixEditor.style.boxShadow = 'none'
          trixEditor.style.outline = 'none'
          trixEditor.style.background = 'transparent'
          
          // Also ensure the input field container doesn't have extra borders
          textarea.style.boxShadow = 'none'
          textarea.style.outline = 'none'
          
          // Add CSS class to remove border
          textarea.classList.add('social-feed-input-no-border')
        }
        
        // Also check for any wrapper elements that might have borders
        const inputContainer = textarea.closest('.flex-1')
        if (inputContainer) {
          inputContainer.style.border = 'none'
          inputContainer.style.boxShadow = 'none'
          inputContainer.style.outline = 'none'
        }
        
        // Check the parent form container
        const formContainer = textarea.closest('.flex.items-start.gap-3')
        if (formContainer) {
          formContainer.style.border = 'none'
          formContainer.style.boxShadow = 'none'
          formContainer.style.outline = 'none'
        }
      }
    }
    
    // Also try again after a short delay in case Trix editor is being re-initialized
    setTimeout(() => {
      if (this.hasInputFieldTarget) {
        const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
        if (textarea) {
          const trixEditor = textarea.querySelector('trix-editor')
          if (trixEditor) {
            trixEditor.style.border = 'none'
            trixEditor.style.boxShadow = 'none'
            trixEditor.style.outline = 'none'
            trixEditor.style.background = 'transparent'
            
            textarea.style.boxShadow = 'none'
            textarea.style.outline = 'none'
            textarea.classList.add('social-feed-input-no-border')
          }
          
          // Reset wrapper elements again
          const inputContainer = textarea.closest('.flex-1')
          if (inputContainer) {
            inputContainer.style.border = 'none'
            inputContainer.style.boxShadow = 'none'
            inputContainer.style.outline = 'none'
          }
          
          const formContainer = textarea.closest('.flex.items-start.gap-3')
          if (formContainer) {
            formContainer.style.border = 'none'
            formContainer.style.boxShadow = 'none'
            formContainer.style.outline = 'none'
          }
        }
      }
    }, 100)
  }
}
