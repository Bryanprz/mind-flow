import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "button"]
  static classes = ["expanded", "collapsed"]

  connect() {
    // Initialize as collapsed by default
    this.collapse()
  }

  toggle() {
    this.isExpanded() ? this.collapse() : this.expand()
  }

  isExpanded() {
    return this.contentTarget.classList.contains(this.expandedClass)
  }

  expand() {
    this.contentTarget.classList.remove(this.collapsedClass)
    this.contentTarget.classList.add(this.expandedClass)
    this.buttonTarget.textContent = 'See Less'
    this.buttonTarget.setAttribute('aria-expanded', 'true')
  }

  collapse() {
    this.contentTarget.classList.remove(this.expandedClass)
    this.contentTarget.classList.add(this.collapsedClass)
    this.buttonTarget.textContent = 'See More'
    this.buttonTarget.setAttribute('aria-expanded', 'false')
  }
}
