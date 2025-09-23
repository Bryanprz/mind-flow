import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static values = { url: String, id: Number, parentId: Number }

  connect() {
    this.sortable = Sortable.create(this.element, {
      onEnd: this.end.bind(this),
      animation: 150,
      handle: '.drag-handle'
    })
  }

  async end(event) {
    const actualItems = Array.from(event.from.children).filter(item => 
      item.dataset.sortableIdValue !== undefined
    );
    
    // Calculate 1-based position in the filtered list
    const actualPosition = actualItems.indexOf(event.item) + 1;
    const newPosition = actualPosition; // 1-based for acts_as_list
    
    const id = event.item.dataset.sortableIdValue;
    
    // Prepare the URL
    let url = this.urlValue.replace('/0/', `/${id}/`);
    if (this.hasParentIdValue) {
      url = url.replace('/0/', `/${this.parentIdValue}/`);
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ position: newPosition })
      });
      
      // Update the UI to reflect the new position
      if (this.hasUpdatedCallback) {
        this.dispatch('updated', { id, position: newPosition });
      }
      
    } catch (error) {
      console.error('Failed to update position:', error);
      throw error;
    }
  }
}
