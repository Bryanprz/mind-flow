import React from 'react'
import { createRoot } from 'react-dom/client'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
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
  const container = document.getElementById('react-analytics')

  if (container) {
    let analyticsData = null
    try {
      analyticsData = JSON.parse(container.dataset.analyticsData || 'null')
      console.log('Analytics data loaded:', analyticsData)
    } catch (e) {
      console.error('Error parsing analytics data:', e)
    }

    const props = {
      analyticsData: analyticsData
    }

    console.log('Rendering AnalyticsDashboard with props:', props)
    const root = createRoot(container)
    root.render(React.createElement(AnalyticsDashboard, props))
  } else {
    console.error('Analytics container not found!')
  }
})
