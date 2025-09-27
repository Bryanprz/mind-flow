import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class ModalController extends Controller {
  connect() {
    // Check if this is a dialog element
    if (this.element.tagName === 'DIALOG') {
      // Handle clicking outside the modal (backdrop click)
      this.element.addEventListener('click', (event) => {
        // Only close if clicking on the backdrop (the dialog element itself)
        // Don't close if clicking on modal content
        if (event.target === this.element) {
          this.close()
        }
      })
      
      // Prevent clicks inside the modal content from bubbling up
      this.element.addEventListener('click', (event) => {
        // If the click is on the modal-box or its children, stop propagation
        if (event.target.closest('.modal-box')) {
          event.stopPropagation()
        }
      })
    }
  }

  open() {
    if (this.element.tagName === 'DIALOG') {
      this.element.showModal()
    }
  }

  close() {
    if (this.element.tagName === 'DIALOG') {
      this.element.close()
    } else {
      // Fallback for non-dialog elements - hide the modal
      this.element.style.display = 'none'
    }
  }
}