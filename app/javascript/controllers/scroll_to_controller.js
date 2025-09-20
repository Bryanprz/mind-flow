import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // This will be called when the element is connected to the DOM
  }

  scrollTop() {
    // Find the scrollable container
    const scrollableContainer = document.getElementById('social-feed-scroll')
    if (scrollableContainer) {
      // Scroll to the top of the container
      scrollableContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      // Remove this controller after scrolling
      this.element.remove()
    }
  }
}
