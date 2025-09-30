import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Animate the message in when it's added to the DOM
    this.animateIn()
  }
  
  animateIn() {
    // Use requestAnimationFrame to ensure the element is rendered
    requestAnimationFrame(() => {
      this.element.style.opacity = '1'
      this.element.style.transform = 'translateY(0)'
    })
  }
}
