import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-preview"
export default class extends Controller {
  static targets = ["fileInput", "preview", "form", "inputField", "previewContainer", "previewGrid"]
  static values = { formId: String }

  connect() {
    this.boundHandleFileSelect = this.handleFileSelect.bind(this)
    this.isFileInputClicking = false // Flag to prevent recursive clicks
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
    
    // Prevent event bubbling to avoid multiple triggers
    event.stopPropagation()
    
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
      this.fileInputTarget.addEventListener('change', this.boundHandleFileSelect)
      console.log('File input setup complete')
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
  }

  handleFileSelect(event) {
    console.log('handleFileSelect triggered', event.target.files?.length)
    const files = event.target.files
    if (files && files.length > 0) {
      console.log('Files selected:', files.length)
      this.showImagePreviews(files)
    } else {
      console.log('No files selected or files cleared')
    }
  }

  showImagePreviews(files) {
    // Clear existing previews
    if (this.hasPreviewGridTarget) {
      this.previewGridTarget.innerHTML = ''
    }

    // Show preview container
    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.remove('hidden')
    }

    // Show each selected image
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        this.createImagePreview(file, index)
      }
    })

    // Expand the input field
    this.expandInputField()
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
    }
  }

  collapseInputField() {
    if (this.hasInputFieldTarget) {
      const textarea = this.inputFieldTarget.querySelector('.social-feed-input')
      if (textarea) {
        textarea.classList.remove('expanded')
      }
    }
  }
}
