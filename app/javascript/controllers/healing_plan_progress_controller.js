import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["progress", "item"]

  connect() {
    this.update()
  }

  toggle() {
    this.update()
  }

  update() {
    const totalItems = this.itemTargets.length
    const completedItems = this.itemTargets.filter(item => this.isCompleted(item)).length

    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
    this.progressTarget.value = percentage

    this.itemTargets.forEach(itemElement => {
      const labelText = itemElement.querySelector('.label-text')
      if (this.isCompleted(itemElement)) {
        labelText.classList.add("line-through", "text-gray-400")
      } else {
        labelText.classList.remove("line-through", "text-gray-400")
      }
    })
  }

  isCompleted(itemElement) {
    const checkbox = itemElement.querySelector('input[type="checkbox"]')
    return checkbox.checked
  }
}
