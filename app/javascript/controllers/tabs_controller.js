import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tabs"
export default class extends Controller {
  static targets = ["tab", "pane"]
  static values = { activeTab: String }

  connect() {
    // Initialize the first tab as active if none is active
    if (!this.tabTargets.some(tab => tab.classList.contains('tab-active'))) {
      this.activateTab(this.tabTargets[0])
    }
  }

  switchTab(event) {
    event.preventDefault()
    this.activateTab(event.currentTarget)
  }
  
  showTab(event) {
    event.preventDefault()
    const tabId = event.params.tab
    const tab = this.tabTargets.find(t => t.getAttribute('data-tab') === tabId)
    if (tab) this.activateTab(tab)
  }
  
  activateTab(tab) {
    const tabId = tab.getAttribute('data-tab')
    
    // Update active tab
    this.tabTargets.forEach(t => t.classList.remove('tab-active'))
    tab.classList.add('tab-active')
    
    // Show corresponding content
    this.paneTargets.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.remove('hidden')
      } else {
        pane.classList.add('hidden')
      }
    })
  }
}
