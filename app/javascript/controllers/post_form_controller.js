import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["formContainer"]

  toggle() {
    this.formContainerTarget.classList.toggle("hidden")
  }
}
