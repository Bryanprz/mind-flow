import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  toggle() {
    const menu = this.element.querySelector('.dropdown-content')
    if (menu) {
      menu.classList.toggle('hidden')
    }
  }

  connect() {
    // Hide dropdown initially
    const menu = this.element.querySelector('.dropdown-content')
    if (menu) {
      menu.classList.add('hidden')
    }
  }
}