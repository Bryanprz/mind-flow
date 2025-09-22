import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="collapsible"
export default class extends Controller {
  static targets = ["content", "arrow"]
  static classes = ["expanded"]
  static values = { 
    expanded: { type: Boolean, default: false },
    persist: { type: Boolean, default: false },
    storageKey: { type: String, default: '' }
  }

  connect() {
    // Generate a unique ID for this collapsible if it doesn't have one
    if (!this.element.id) {
      this.element.id = `collapsible-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Find the content target relative to the controller element
    this.contentElement = this.element.querySelector('[data-collapsible-target="content"]');
    this.arrowElement = this.element.querySelector('[data-collapsible-target="arrow"]');
    
    if (!this.contentElement) {
      console.warn('No content target found for collapsible', this.element);
      return;
    }

    // Initialize content style
    this.contentElement.style.overflow = 'hidden';
    
    // Try to load state from localStorage if persist is enabled
    if (this.persistValue && this.storageKeyValue) {
      const storedState = localStorage.getItem(this.storageKeyValue);
      if (storedState !== null) {
        this.expandedValue = storedState === 'true';
      }
    }

    // Initialize state based on the presence of the expanded class if not set
    if (this.expandedValue === undefined) {
      this.expandedValue = !this.contentElement.classList.contains('hidden');
    }

    // Initialize the content visibility
    this.update();
    
    // If expanded, show the content immediately
    if (this.expandedValue) {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  toggle(event) {
    // Don't toggle if the click was on an input, button, or link
    if (event && (event.target.tagName === 'INPUT' || 
                  event.target.tagName === 'BUTTON' || 
                  event.target.tagName === 'A' ||
                  event.target.closest('button, a, [data-sortable-handle]'))) {
      return
    }

    this.expandedValue = !this.expandedValue
    this.update()
  }

  expandedValueChanged() {
    this.update()
    
    // Save state to localStorage if persist is enabled
    if (this.persistValue && this.storageKeyValue) {
      localStorage.setItem(this.storageKeyValue, this.expandedValue)
    }
  }

  update() {
    if (!this.contentElement) return;
    
    // Toggle content visibility with animation
    if (this.expandedValue) {
      this.showContent();
    } else {
      this.hideContent();
    }

    // Toggle arrow rotation
    if (this.arrowElement) {
      const arrow = this.arrowElement.querySelector('svg') || this.arrowElement;
      if (arrow) {
        arrow.classList.toggle('rotate-180', this.expandedValue);
      }
    }

    // Toggle expanded class on the main element
    this.element.classList.toggle(this.expandedClass, this.expandedValue);
  }

  showContent() {
    if (!this.contentElement) return;
    
    const content = this.contentElement;
    
    // Make sure content is visible
    content.classList.remove('hidden');
    content.style.display = 'block';
    
    // Add transition classes
    content.classList.add('transition-all', 'duration-200', 'ease-in-out');
    
    // Set initial state
    content.style.maxHeight = '0';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';
    
    // Force reflow to ensure initial state is applied
    void content.offsetHeight;
    
    // Animate to full height
    const fullHeight = content.scrollHeight + 'px';
    content.style.maxHeight = fullHeight;
    content.style.opacity = '1';
    
    // Clean up after animation
    setTimeout(() => {
      if (content) {
        content.style.overflow = 'visible';
        content.style.maxHeight = 'none';
      }
    }, 200);
  }
  
  hideContent() {
    if (!this.contentElement) return;
    
    const content = this.contentElement;
    
    // Set initial state
    const fullHeight = content.scrollHeight + 'px';
    content.style.maxHeight = fullHeight;
    content.style.opacity = '1';
    content.style.overflow = 'hidden';
    
    // Force reflow to ensure initial state is applied
    void content.offsetHeight;
    
    // Animate to zero height
    content.style.maxHeight = '0';
    content.style.opacity = '0';
    
    // Hide after animation completes
    setTimeout(() => {
      if (content) {
        content.style.display = 'none';
        content.classList.add('hidden');
      }
    }, 200);
  }

  // Public method to expand/collapse programmatically
  expand() {
    this.expandedValue = true
  }

  collapse() {
    this.expandedValue = false
  }
}
