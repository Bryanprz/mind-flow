import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tabs"
export default class extends Controller {
  static targets = ["tab", "pane"]
  static values = { activeTab: String }

  connect() {
    console.log('Tabs controller connected')
    console.log('Tab targets:', this.tabTargets.length)
    console.log('Pane targets:', this.paneTargets.length)
    
    // Wait a bit for DOM to be ready, then initialize
    setTimeout(() => {
      this.initializeTabs()
    }, 100)
  }

  initializeTabs() {
    console.log('Initializing tabs')
    // Find the active tab or default to first
    let activeTab = this.tabTargets.find(tab => tab.classList.contains('tab-active'))
    if (!activeTab && this.tabTargets.length > 0) {
      activeTab = this.tabTargets[0]
    }
    
    if (activeTab) {
      this.activateTab(activeTab)
    }
  }

  switchTab(event) {
    console.log('switchTab called', event.currentTarget)
    event.preventDefault()
    event.stopPropagation()
    this.activateTab(event.currentTarget)
  }
  
  showTab(event) {
    console.log('showTab called', event.params)
    event.preventDefault()
    event.stopPropagation()
    const tabId = event.params.tab
    const tab = this.tabTargets.find(t => t.getAttribute('data-tab') === tabId)
    console.log('Found tab:', tab, 'for id:', tabId)
    if (tab) {
      this.activateTab(tab)
    }
  }
  
  activateTab(tab) {
    console.log('activateTab called', tab)
    const tabId = tab.getAttribute('data-tab')
    console.log('Tab ID:', tabId)
    
    // Update active tab styling
    this.tabTargets.forEach(t => {
      t.classList.remove('tab-active')
      t.classList.add('text-neutral-content')
    })
    tab.classList.add('tab-active')
    tab.classList.remove('text-neutral-content')
    
    // Show corresponding content
    this.paneTargets.forEach(pane => {
      console.log('Checking pane:', pane.id, 'against tabId:', tabId)
      if (pane.id === tabId) {
        pane.classList.remove('hidden')
        console.log('Showing pane:', pane.id)
      } else {
        pane.classList.add('hidden')
        console.log('Hiding pane:', pane.id)
      }
    })
  }
}
