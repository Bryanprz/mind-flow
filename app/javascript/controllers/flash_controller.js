import { Controller } from "@hotwired/stimulus"

export default class FlashController extends Controller {
  connect() {
    setTimeout(() => {
      this.element.classList.add("opacity-0") // Use Tailwind's opacity-0
    }, 3000) // 3 seconds
  }

  remove() {
    // Remove the element from the DOM after the transition ends
    if (this.element.classList.contains("opacity-0")) { // Check for opacity-0
      this.element.remove()
    }
  }
}
