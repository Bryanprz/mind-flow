import React from 'react'
import { createRoot } from 'react-dom/client'
import FocusTrendsChart from '../components/dashboard/FocusTrendsChart'
import '../styles/application.css'

// Mount the FocusTrendsChart component
document.addEventListener('DOMContentLoaded', function() {
  const chartContainer = document.getElementById('focus-trends-chart')
  if (chartContainer) {
    const root = createRoot(chartContainer)
    root.render(React.createElement(FocusTrendsChart))
  }
})
