import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  connect() {
    this.hide()
  }

  toggle() {
    this.menuTarget.classList.toggle("hidden")
  }

  hide(event) {
    if (event && this.element.contains(event.target)) {
      return
    }
    this.menuTarget.classList.add("hidden")
  }
}