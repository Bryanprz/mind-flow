
import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["item"]
  static values = {
    handle: { type: String, default: "[data-sortable-handle]" },
    animation: { type: Number, default: 150 },
    ghostClass: { type: String, default: "sortable-ghost" },
    chosenClass: { type: String, default: "sortable-chosen" },
    dragClass: { type: String, default: "sortable-drag" },
    draggable: { type: String, default: ".sortable-item" },
    group: { type: String, default: "" },
  }

  connect() {
    console.log("Sortable controller connected")
    this.initSortable()
  }

  initSortable() {
    const container = this.element;
    
    // Destroy existing instance if it exists
    if (this.sortable) {
      this.sortable.destroy();
    }
    
    // Initialize Sortable with updated options
    this.sortable = new Sortable(container, {
      animation: 150,
      handle: this.handleValue,
      ghostClass: this.ghostClassValue,
      chosenClass: this.chosenClassValue,
      dragClass: this.dragClassValue,
      draggable: this.draggableValue,
      group: this.groupValue || undefined,
      forceFallback: true,
      fallbackTolerance: 3,
      swapThreshold: 0.65,
      invertSwap: true,
      direction: 'vertical',
      
      // Improved event handling
      onStart: (event) => {
        document.body.classList.add('is-dragging');
        event.item.classList.add('sortable-active', 'sorting');
        event.item.style.transition = 'none';
      },
      
      onEnd: (event) => {
        document.body.classList.remove('is-dragging');
        event.item.classList.remove('sortable-active', 'sorting');
        event.item.style.transition = '';
        this.updateOrdering();
      },
      
      onUpdate: (event) => {
        this.updateOrdering();
      },
      
      onSort: (event) => {
        // Force reflow to ensure smooth animation
        const item = event.item;
        if (item) {
          // Temporarily disable transitions
          const transition = item.style.transition;
          item.style.transition = 'none';
          
          // Force reflow
          void item.offsetHeight;
          
          // Re-enable transitions
          setTimeout(() => {
            item.style.transition = transition;
          }, 0);
        }
      },
      
      onChange: () => {
        // Force update the DOM
        container.style.display = 'none';
        void container.offsetHeight;
        container.style.display = '';
      },
      
      onMove: (evt) => {
        // Only allow dropping on valid sortable items
        const related = evt.related;
        const draggable = evt.dragged;
        
        // Don't allow dropping on itself or non-sortable items
        if (related === draggable || !related.matches(this.draggableValue)) {
          return false;
        }
        
        // Check if we're moving up or down
        const rect = related.getBoundingClientRect();
        const middle = rect.top + (rect.height / 2);
        const clientY = evt.clientY || (evt.originalEvent && evt.originalEvent.clientY);
        
        // Return true to insert before or after based on mouse position
        return clientY > middle ? 'before' : 'after';
      }
    });
    
    // Initial ordering
    this.updateOrdering();
    console.log("Sortable initialized with updated settings");
  }

  disconnect() {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }
  }

  updateOrdering() {
    if (!this.sortable) return;
    
    try {
      // Get all direct children that match our draggable selector
      const items = Array.from(this.element.children).filter(el => {
        return el.matches(this.draggableValue) || el.classList.contains('sortable-item');
      });
      
      // Update the ordering of each item
      items.forEach((item, index) => {
        // Update the ordering in the hidden input
        const input = item.querySelector('input[type="hidden"][name$="[ordering]"]');
        if (input) {
          input.value = index;
        }
        
        // Also update the data-ordering attribute for reference
        if (item.dataset) {
          item.dataset.ordering = index;
        }
      });
      
      console.log("Updated ordering for", items.length, "items");
    } catch (error) {
      console.error("Error updating ordering:", error);
    }
  }
}
