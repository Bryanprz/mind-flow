import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static values = { url: String, id: Number, parentId: Number }

  connect() {
    this.sortable = Sortable.create(this.element, {
      onEnd: this.end.bind(this),
      animation: 150,
      handle: '.drag-handle' // Add a handle for dragging
    })
  }

  async end(event) {
    const id = event.item.dataset.sortableIdValue
    const newPosition = event.newIndex + 1

    let url = this.urlValue.replace('/0/', `/${id}/`)

    // If a parentId is provided, replace the second /0/ in the URL for nested resources
    if (this.hasParentIdValue) {
      url = url.replace('/0/', `/${this.parentIdValue}/`)
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content

    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ position: newPosition })
    })
  }
}
