import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.classList.remove("opacity-0")
    this.element.classList.add("opacity-100")
  }
}