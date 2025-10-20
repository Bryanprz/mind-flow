import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  async toggleItem(event) {
    const checkbox = event.target
    const completed = checkbox.checked

    // Add visual feedback
    const label = checkbox.closest('.flex').querySelector('.flex-1 div')
    if (completed) {
      label.classList.add('line-through', 'text-gray-500')
    } else {
      label.classList.remove('line-through', 'text-gray-500')
    }
  }
}

