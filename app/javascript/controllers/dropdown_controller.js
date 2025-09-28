import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "button"]

  toggle() {
    const menu = this.element.querySelector('.dropdown-content')
    if (menu) {
      menu.classList.toggle('hidden')
    }
  }

  hide() {
    const menu = this.element.querySelector('.dropdown-content')
    if (menu) {
      menu.classList.add('hidden')
    }
  }

  connect() {
    // Hide dropdown initially
    const menu = this.element.querySelector('.dropdown-content')
    if (menu) {
      menu.classList.add('hidden')
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", this.handleClickOutside.bind(this))
  }

  disconnect() {
    document.removeEventListener("click", this.handleClickOutside)
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide()
    }
  }
}