import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-preview"
export default class extends Controller {
  static targets = ["fileInput", "preview", "form", "inputField", "previewContainer", "previewGrid", "card"]
  static values = { formId: String }

  connect() {
    console.log('Image preview controller connected')
    this.boundHandleFileSelect = this.handleFileSelect.bind(this)
    this.isFileInputClicking = false // Flag to prevent recursive clicks
    this.processingFiles = false // Flag to prevent double processing
    this.setupFileInput()
    this.setupDragAndDrop()
    
    // Debug: Log available targets
    console.log('Available targets:', {
      fileInput: this.hasFileInputTarget,
      preview: this.hasPreviewTarget,
      form: this.hasFormTarget,
      inputField: this.hasInputFieldTarget,
      previewContainer: this.hasPreviewContainerTarget,
      previewGrid: this.hasPreviewGridTarget,
      card: this.hasCardTarget
    })
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
          console.log('File input setup complete')
        } else {
          console.log('File input target not found during setup')
        }
      }, 100) // Increased delay for turbo stream updates
    } else {
      console.log('No file input target found during setup')
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

  handleFiles(files) {
    // Prevent double processing
    if (this.processingFiles) {
      console.log('File processing already in progress, ignoring drag/drop')
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
      console.log(`Form ${this.formIdValue || 'unknown'} handling ${files.length} files`)
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
      previewItem.className = 'relative'
      
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
      }
    }
    
    // Collapse the card
    this.collapseCard()
  }

  expandCard() {
    if (this.hasCardTarget) {
      console.log('Expanding card for image previews')
      
      // Check if we're in a room/chat context
      const isRoomContext = this.element.closest('#messages') || 
                           this.element.closest('.room') ||
                           this.element.closest('[data-controller*="room-channel"]')
      
      // Add CSS class for expansion
      this.cardTarget.classList.add('expanded-card')
      
      if (isRoomContext) {
        console.log('Room context - using conservative card expansion to prevent scroll issues')
        // For room context, only expand the preview container, not the entire card
        this.cardTarget.style.transition = 'all 0.3s ease-in-out'
        
        // Only expand the preview container, not the card itself
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
          console.log('Preview container expanded (room mode)')
        }
        
        // Prevent scroll to top by maintaining current scroll position
        this.restoreScrollPosition()
      } else {
        console.log('Non-room context - using balanced card expansion for image previews')
        // For non-room, use balanced expansion that shows image previews but preserves scroll
        this.cardTarget.style.transition = 'all 0.3s ease-in-out'
        
        // Expand the card to accommodate image previews
        this.cardTarget.style.overflow = 'visible'
        this.cardTarget.style.maxHeight = 'none'
        
        // Expand the card body to accommodate images
        const cardBody = this.cardTarget.querySelector('.card-body')
        if (cardBody) {
          cardBody.style.height = 'auto'
          cardBody.style.maxHeight = 'none'
          cardBody.style.overflow = 'visible'
          console.log('Card body expanded for image previews')
        }
        
        // Ensure preview container is fully visible
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
          this.previewContainerTarget.style.minHeight = '80px' // Ensure enough space for images
          console.log('Preview container expanded for image visibility')
        }
        
        // Override parent constraints more aggressively for image preview visibility
        this.overrideParentConstraintsForImagePreview()
        
        console.log('Card expansion completed (balanced mode)')
      }
      
      console.log('Card expanded with classes:', this.cardTarget.classList.toString())
    } else {
      console.log('No card target found for expansion - trying fallback')
      // Fallback: try to find the card element manually
      const cardElement = this.element.querySelector('[data-image-preview-target="card"]')
      if (cardElement) {
        console.log('Found card element via fallback')
        cardElement.classList.add('expanded-card')
        cardElement.style.transition = 'all 0.3s ease-in-out'
        
        // Only expand the preview container
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
          console.log('Preview container expanded (fallback mode)')
        }
      } else {
        console.log('No card element found even with fallback')
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
      console.log('Room context detected - using minimal constraint override to preserve scroll')
      // In room context, only override the immediate parent of the card
      // Don't touch the messages container or its parents
      let currentElement = this.cardTarget.parentElement
      let depth = 0
      const maxDepth = 2 // Very limited depth for room context
      
      while (currentElement && depth < maxDepth) {
        // Don't modify the messages container or its parents
        if (currentElement.id === 'messages' || 
            currentElement.classList.contains('h-full') ||
            currentElement.classList.contains('overflow-y-auto')) {
          console.log('Skipping messages container to preserve scroll')
          break
        }
        
        const computedStyle = window.getComputedStyle(currentElement)
        const maxHeight = computedStyle.maxHeight
        
        // Only override if it's clearly constraining the preview and not critical for layout
        if (maxHeight !== 'none' && maxHeight !== '100%' && !currentElement.classList.contains('flex-1')) {
          console.log('Overriding constraint at depth', depth, ':', currentElement.className)
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
        const computedStyle = window.getComputedStyle(currentElement)
        const height = computedStyle.height
        const maxHeight = computedStyle.maxHeight
        const overflow = computedStyle.overflow
        const minHeight = computedStyle.minHeight
        
        if (height !== 'auto' || maxHeight !== 'none' || overflow === 'hidden' || overflow === 'auto' || minHeight !== '0px') {
          console.log('Found constraining parent at depth', depth, ':', currentElement.className)
          
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
    console.log('Overriding parent constraints for image preview visibility')
    let currentElement = this.cardTarget.parentElement
    let depth = 0
    const maxDepth = 6 // More aggressive for image preview visibility
    
    while (currentElement && depth < maxDepth) {
      const computedStyle = window.getComputedStyle(currentElement)
      const height = computedStyle.height
      const maxHeight = computedStyle.maxHeight
      const overflow = computedStyle.overflow
      const minHeight = computedStyle.minHeight
      
      // Be more aggressive about removing constraints for image preview visibility
      if (height !== 'auto' || maxHeight !== 'none' || overflow === 'hidden' || overflow === 'auto' || minHeight !== '0px') {
        console.log('Removing constraint for image preview at depth', depth, ':', currentElement.className)
        
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
      
      console.log('Stored scroll position:', {
        scrollTop: this.storedScrollTop,
        scrollHeight: this.storedScrollHeight,
        clientHeight: this.storedClientHeight,
        isAtBottom: this.storedScrollTop >= (this.storedScrollHeight - this.storedClientHeight - 50)
      })
      
      // Create anchor element at the bottom of messages
      this.createScrollAnchor()
      
      // Temporarily disable auto-scrolling in the scroll-to controller
      const scrollToController = this.getScrollToController()
      if (scrollToController) {
        console.log('Disabling auto-scroll in scroll-to controller')
        scrollToController.disableAutoScroll()
        // Store reference for later re-enabling
        this.scrollToController = scrollToController
      }
      
      // Add scroll event listener to monitor what's happening
      this.scrollMonitor = (event) => {
        console.log('Scroll event detected:', {
          scrollTop: messagesContainer.scrollTop,
          scrollHeight: messagesContainer.scrollHeight,
          clientHeight: messagesContainer.clientHeight,
          target: event.target
        })
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
      console.log('Created scroll anchor at preview container:', this.scrollAnchor.id)
    } else if (this.hasCardTarget) {
      this.cardTarget.appendChild(this.scrollAnchor)
      console.log('Created scroll anchor at card:', this.scrollAnchor.id)
    } else {
      // Fallback to messages container
      const messagesContainer = document.getElementById('messages')
      if (messagesContainer) {
        messagesContainer.appendChild(this.scrollAnchor)
        console.log('Created scroll anchor at messages container:', this.scrollAnchor.id)
      }
    }
  }
  
  // Method to remove scroll anchor
  removeScrollAnchor() {
    if (this.scrollAnchor && this.scrollAnchor.parentNode) {
      this.scrollAnchor.parentNode.removeChild(this.scrollAnchor)
      this.scrollAnchor = null
      console.log('Removed scroll anchor')
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
        
        console.log('Scroll restoration details:', {
          storedScrollTop: this.storedScrollTop,
          storedScrollHeight: this.storedScrollHeight,
          currentScrollHeight: currentScrollHeight,
          heightDifference: heightDifference
        })
        
        // If we were at the bottom before, use anchor to scroll to bottom
        const bottomThreshold = 50 // pixels from bottom
        const wasAtBottom = this.storedScrollTop >= (this.storedScrollHeight - this.storedClientHeight - bottomThreshold)
        
        if (wasAtBottom) {
          // User was at the bottom - scroll to anchor
          console.log('User was at bottom, scrolling to anchor')
          this.scrollToAnchor()
        } else {
          // User was scrolled up, maintain their relative position
          const newScrollTop = this.storedScrollTop + heightDifference
          const maxScrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight
          const finalScrollTop = Math.min(newScrollTop, maxScrollTop)
          
          messagesContainer.scrollTop = finalScrollTop
          console.log('Maintained relative position:', finalScrollTop)
        }
        
        // Re-enable auto-scrolling after a delay
        setTimeout(() => {
          if (this.scrollToController) {
            console.log('Re-enabling auto-scroll after delay')
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
      console.log('Scrolling to anchor:', this.scrollAnchor.id)
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
        console.log('Fallback: scrolled to bottom')
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
    console.log('Attempting to restore layout for scroll')
    const messagesContainer = document.getElementById('messages')
    if (!messagesContainer) return
    
    // Find and reset any parent containers that might be causing layout issues
    let currentElement = messagesContainer.parentElement
    let depth = 0
    const maxDepth = 5
    
    while (currentElement && depth < maxDepth) {
      // Reset any problematic styles that might be preventing proper height
      if (currentElement.classList.contains('image-preview-expanded')) {
        console.log('Resetting expanded parent at depth', depth)
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
    console.log('Forcing messages container height')
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
      console.log('Locking scroll position at bottom')
      
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
      console.log('Starting continuous scroll maintenance with anchor')
      
      // Scroll to anchor every 100ms for 1 second
      let attempts = 0
      const maxAttempts = 10 // 1 second at 100ms intervals
      
      this.scrollMaintenanceInterval = setInterval(() => {
        attempts++
        this.scrollToAnchor()
        
        if (attempts >= maxAttempts) {
          console.log('Continuous scroll maintenance completed')
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
}
