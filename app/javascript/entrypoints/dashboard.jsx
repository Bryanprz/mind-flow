import React from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from '../components/Dashboard'
import '../styles/application.css'

// Pure React component - no Stimulus mixing
// Stimulus handles navbar behavior globally via application.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dashboard-root')
  
  if (container) {
    const props = JSON.parse(container.dataset.props || '{}')
    const root = createRoot(container)
    root.render(React.createElement(Dashboard, props))
    console.log('✅ Dashboard React component mounted')
  } else {
    console.error('❌ Dashboard container not found')
  }
})