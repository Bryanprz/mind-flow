import React from 'react'
import { createRoot } from 'react-dom/client'
import NotificationsDashboard from '../components/NotificationsDashboard'
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
  const container = document.getElementById('react-notifications')

  if (container) {
    let notificationsData = null
    try {
      notificationsData = JSON.parse(container.dataset.notificationsData || 'null')
    } catch (e) {
      console.error('Error parsing notifications data:', e)
    }

    const props = {
      notificationsData: notificationsData
    }

    const root = createRoot(container)
    root.render(React.createElement(NotificationsDashboard, props))
  }
})
