import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-preview"
export default class extends Controller {
  static targets = ["fileInput", "preview", "form", "inputField", "previewContainer", "previewGrid", "card"]
  static values = { formId: String }

  connect() {
    this.boundHandleFileSelect = this.handleFileSelect.bind(this)
    this.isFileInputClicking = false // Flag to prevent recursive clicks
    this.processingFiles = false // Flag to prevent double processing
    this.setupFileInput()
    this.setupDragAndDrop()
  }

  handleFileClick(event) {
    console.log('handleFileClick triggered', event.target)
    
    // Prevent recursive calls from file input clicks
    if (event.target.type === 'file' || event.target === this.fileInputTarget) {
      console.log('Ignoring file input click to prevent recursion')
      return
    }
    
    // Prevent double processing
    if (this.processingFiles) {
      console.log('File processing already in progress, ignoring click')
      return
    }
    
    // Prevent event bubbling to avoid multiple triggers
    event.stopPropagation()
    event.preventDefault()
    
    // Trigger the hidden file input when the icon is clicked
    if (this.hasFileInputTarget) {
      console.log('Clicking file input')
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
        this.fileInputTarget.addEventListener('change', this.boundHandleFileSelect)
        console.log('File input setup complete')
      }, 10)
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
    console.log('handleFileSelect triggered', event.target.files?.length)
    
    // Prevent double processing
    if (this.processingFiles) {
      console.log('File processing already in progress, ignoring')
      return
    }
    
    this.processingFiles = true
    
    const files = event.target.files
    if (files && files.length > 0) {
      console.log('Files selected:', files.length)
      this.showImagePreviews(files)
    } else {
      console.log('No files selected or files cleared')
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      this.processingFiles = false
    }, 200)
  }

  showImagePreviews(files) {
    console.log('showImagePreviews called with', files.length, 'files')
    
    // Clear existing previews
    if (this.hasPreviewGridTarget) {
      this.previewGridTarget.innerHTML = ''
    }

    // Show preview container
    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.remove('hidden')
      console.log('Preview container shown')
    }

    // Show each selected image
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        this.createImagePreview(file, index)
      }
    })

    // Expand the input field
    this.expandInputField()
    
    // Expand the card to accommodate images
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
      previewItem.className = 'relative aspect-square overflow-hidden rounded-lg'
      
      const img = document.createElement('img')
      img.src = e.target.result
      img.className = 'w-full h-full object-cover'
      img.alt = `Preview ${index + 1}`
      
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.className = 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
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
      
      // Add CSS class for expansion
      this.cardTarget.classList.add('expanded-card')
      
      // Also set inline styles as backup
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
      
      console.log('Card expanded with classes:', this.cardTarget.classList.toString())
    } else {
      console.log('No card target found for expansion')
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
    // Check parent containers for height constraints
    let currentElement = this.cardTarget.parentElement
    let depth = 0
    const maxDepth = 8 // Increased depth to reach more parent containers
    
    while (currentElement && depth < maxDepth) {
      // Check if parent has height constraints
      const computedStyle = window.getComputedStyle(currentElement)
      const height = computedStyle.height
      const maxHeight = computedStyle.maxHeight
      const overflow = computedStyle.overflow
      const minHeight = computedStyle.minHeight
      
      // More aggressive constraint detection
      if (height !== 'auto' || maxHeight !== 'none' || overflow === 'hidden' || overflow === 'auto' || minHeight !== '0px') {
        console.log('Found constraining parent at depth', depth, ':', currentElement.className, {
          height, maxHeight, overflow, minHeight
        })
        
        // Override parent constraints more aggressively
        currentElement.style.height = 'auto'
        currentElement.style.maxHeight = 'none'
        currentElement.style.minHeight = 'auto'
        currentElement.style.overflow = 'visible'
        currentElement.style.overflowY = 'visible'
        currentElement.style.overflowX = 'visible'
        
        // Remove flex constraints that might limit height
        if (currentElement.classList.contains('flex-1')) {
          currentElement.style.flex = 'none'
        }
        
        // Add a temporary class to mark this element
        currentElement.classList.add('image-preview-expanded')
      }
      
      currentElement = currentElement.parentElement
      depth++
    }
    
    // Also check body and html elements
    document.body.style.height = 'auto'
    document.body.style.maxHeight = 'none'
    document.body.style.overflow = 'visible'
    document.documentElement.style.height = 'auto'
    document.documentElement.style.maxHeight = 'none'
    document.documentElement.style.overflow = 'visible'
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
