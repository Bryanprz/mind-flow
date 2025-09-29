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
      img.className = 'w-20 h-20 object-cover rounded-lg border border-gray-200'
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
        this.maintainScrollPosition()
      } else {
        console.log('Non-room context - using full card expansion')
        // For non-room, use the original aggressive expansion
        this.cardTarget.style.transition = 'all 0.3s ease-in-out'
        this.cardTarget.style.overflow = 'visible'
        this.cardTarget.style.height = 'auto'
        this.cardTarget.style.maxHeight = 'none'
        this.cardTarget.style.minHeight = 'auto'
        
        // Force card-body to expand
        const cardBody = this.cardTarget.querySelector('.card-body')
        if (cardBody) {
          cardBody.style.height = 'auto'
          cardBody.style.maxHeight = 'none'
          cardBody.style.overflow = 'visible'
          console.log('Card body expanded')
        }
        
        // Force preview container to be visible and unconstrained
        if (this.hasPreviewContainerTarget) {
          this.previewContainerTarget.style.display = 'block'
          this.previewContainerTarget.style.height = 'auto'
          this.previewContainerTarget.style.maxHeight = 'none'
          this.previewContainerTarget.style.overflow = 'visible'
          console.log('Preview container expanded')
        }
        
        // Check and override any parent container constraints
        this.overrideParentConstraints()
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
    // Check if we're in a dashboard context - be more conservative
    const isDashboard = this.element.closest('.dashboard-content') || 
                       this.element.closest('.social-feed-card') ||
                       this.element.closest('#social_feed')
    
    if (isDashboard) {
      console.log('Dashboard context detected - using conservative constraint override')
      // Only override immediate parent constraints, not the entire hierarchy
      let currentElement = this.cardTarget.parentElement
      let depth = 0
      const maxDepth = 3 // Reduced depth for dashboard
      
      while (currentElement && depth < maxDepth) {
        // Only override if it's not a dashboard grid container
        if (!currentElement.classList.contains('dashboard-grid') && 
            !currentElement.classList.contains('social-feed-card') &&
            !currentElement.classList.contains('card')) {
          
          const computedStyle = window.getComputedStyle(currentElement)
          const height = computedStyle.height
          const maxHeight = computedStyle.maxHeight
          const overflow = computedStyle.overflow
          
          // Only override if it's clearly constraining the preview
          if (maxHeight !== 'none' && maxHeight !== '100%') {
            console.log('Overriding constraint at depth', depth, ':', currentElement.className)
            currentElement.style.maxHeight = 'none'
            currentElement.style.overflow = 'visible'
            currentElement.classList.add('image-preview-expanded')
          }
        }
        
        currentElement = currentElement.parentElement
        depth++
      }
    } else {
      // Non-dashboard context - use original aggressive approach
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
