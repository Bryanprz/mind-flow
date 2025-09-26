import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-preview"
export default class extends Controller {
  static targets = ["fileInput", "preview", "form", "inputField", "previewContainer", "previewGrid"]

  connect() {
    this.boundHandleFileSelect = this.handleFileSelect.bind(this)
    this.setupFileInput()
    this.setupDragAndDrop()
  }

  disconnect() {
    if (this.hasFileInputTarget && this.boundHandleFileSelect) {
      this.fileInputTarget.removeEventListener('change', this.boundHandleFileSelect)
    }
  }

  setupFileInput() {
    if (this.hasFileInputTarget) {
      this.fileInputTarget.addEventListener('change', this.boundHandleFileSelect)
    }
  }

  setupDragAndDrop() {
    // Add drag and drop to the entire form, but prevent it on the textarea
    const form = this.element
    if (form) {
      form.addEventListener('dragover', this.handleDragOver.bind(this))
      form.addEventListener('dragleave', this.handleDragLeave.bind(this))
      form.addEventListener('drop', this.handleDrop.bind(this))
      
      // Prevent drag and drop on the textarea to avoid conflicts
      const textarea = form.querySelector('textarea')
      if (textarea) {
        textarea.addEventListener('dragover', (e) => e.preventDefault())
        textarea.addEventListener('drop', (e) => e.preventDefault())
      }
    }
  }

  handleDragOver(event) {
    event.preventDefault()
    event.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  handleDragLeave(event) {
    event.preventDefault()
    event.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  handleDrop(event) {
    event.preventDefault()
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
    }
  }

  handleFileSelect(event) {
    const files = event.target.files
    if (files && files.length > 0) {
      this.showImagePreviews(files)
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
