import React from 'react'
import { createRoot } from 'react-dom/client'
import GoalsDashboard from '../components/GoalsDashboard'
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
  const container = document.getElementById('react-goals')

  if (container) {
    let goalsData = null
    try {
      goalsData = JSON.parse(container.dataset.goalsData || 'null')
    } catch (e) {
      console.error('Error parsing goals data:', e)
    }

    const props = {
      goalsData: goalsData
    }

    const root = createRoot(container)
    root.render(React.createElement(GoalsDashboard, props))
  }
})
