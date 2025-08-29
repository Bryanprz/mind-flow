import { Controller } from "@hotwired/stimulus"

export default class FlashController extends Controller {
  connect() {
    setTimeout(() => {
      this.element.classList.add("opacity-0", "-translate-y-4")
    }, 5000)
  }

  remove() {
    if (this.element.classList.contains("opacity-0")) {
      this.element.remove()
    }
  }
}
