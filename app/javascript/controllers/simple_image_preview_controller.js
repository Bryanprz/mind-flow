import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["previewContainer", "previewGrid", "fileInput"]

  connect() {
    // Add change event listener to file input
    this.fileInputTarget.addEventListener('change', this.handleFileChange.bind(this))
  }

  disconnect() {
    // Clean up event listener
    this.fileInputTarget.removeEventListener('change', this.handleFileChange.bind(this))
  }

  handleFileClick() {
    this.fileInputTarget.click()
  }

  handleFileChange() {
    const files = Array.from(this.fileInputTarget.files)
    if (files.length === 0) {
      this.hidePreviews()
      return
    }

    this.showPreviews(files)
  }

  showPreviews(files) {
    this.previewGridTarget.innerHTML = ''
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = document.createElement('div')
          preview.className = 'relative rounded-lg overflow-hidden'
          preview.innerHTML = `
            <img src="${e.target.result}" class="w-20 h-20 object-cover rounded-lg" alt="Preview ${index + 1}">
            <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" data-action="click->simple-image-preview#removePreview" data-index="${index}">×</button>
          `
          this.previewGridTarget.appendChild(preview)
        }
        reader.readAsDataURL(file)
      }
    })
    
    this.previewContainerTarget.classList.remove('hidden')
  }

  hidePreviews() {
    this.previewContainerTarget.classList.add('hidden')
    this.previewGridTarget.innerHTML = ''
  }

  removePreview(event) {
    const index = parseInt(event.target.dataset.index)
    const files = Array.from(this.fileInputTarget.files)
    const newFiles = files.filter((_, i) => i !== index)
    
    const dt = new DataTransfer()
    newFiles.forEach(file => dt.items.add(file))
    this.fileInputTarget.files = dt.files
    
    this.handleFileChange()
  }
}