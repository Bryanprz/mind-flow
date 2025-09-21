
import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["item"]

  connect() {
    // Sort items based on data-ordering attribute before initializing Sortable
    const sortedItems = Array.from(this.itemTargets).sort((a, b) => {
      return parseInt(a.dataset.ordering) - parseInt(b.dataset.ordering)
    })

    // Re-append sorted items to the DOM to reflect the correct initial order
    sortedItems.forEach(item => this.element.appendChild(item))

    this.sortable = new Sortable(this.element, {
      animation: 150,
      onEnd: this.onEnd.bind(this),
    })

    // Ensure hidden input fields reflect the initial sorted order
    this.updateOrdering()
  }

  disconnect() {
    this.sortable.destroy()
  }

  createOrderingInput(item, index) {
    let input = item.querySelector("input[type='hidden']")
    if (!input) {
      input = document.createElement("input")
      input.type = "hidden"
      item.appendChild(input)
    }
    input.name = item.dataset.sortableInputName
    input.value = index
  }

  onEnd(event) {
    this.updateOrdering()
  }

  updateOrdering() {
    // Get the current order of items from Sortable.js
    const currentOrderIds = this.sortable.toArray()

    // Update the hidden input fields based on the new order
    currentOrderIds.forEach((id, index) => {
      const item = this.itemTargets.find(item => item.dataset.id === id)
      if (item) {
        const input = item.querySelector(`input[name="${item.dataset.sortableInputName}"]`)
        if (input) {
          input.value = index
        }
      }
    })
  }
}
