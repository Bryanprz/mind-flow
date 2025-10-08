import React from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from '../components/Dashboard'
import '../styles/application.css'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dashboard-root')
  
  if (container) {
    const props = JSON.parse(container.dataset.props || '{}')
    const root = createRoot(container)
    root.render(React.createElement(Dashboard, props))
  } else {
    console.error('Dashboard container not found')
  }
})