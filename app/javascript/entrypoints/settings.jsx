import React from 'react'
import { createRoot } from 'react-dom/client'
import SettingsDashboard from '../components/SettingsDashboard'
import '../styles/application.css'

// Import Stimulus for navbar functionality
import { Application } from "@hotwired/stimulus"
import ScrollNavController from "../controllers/scroll_nav_controller"
import MobileMenuController from "../controllers/mobile_menu_controller"

// Start Stimulus application for navbar
const application = Application.start()
application.debug = false
window.Stimulus = application

// Manually register the controllers needed for navbar
application.register("scroll-nav", ScrollNavController)
application.register("mobile-menu", MobileMenuController)

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-settings')

  if (container) {
    let settingsData = null
    try {
      settingsData = JSON.parse(container.dataset.settingsData || 'null')
    } catch (e) {
      console.error('Error parsing settings data:', e)
    }

    const props = {
      settingsData: settingsData
    }

    const root = createRoot(container)
    root.render(React.createElement(SettingsDashboard, props))
  }
})
