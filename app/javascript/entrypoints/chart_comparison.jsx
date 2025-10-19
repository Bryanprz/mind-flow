import React from 'react'
import { createRoot } from 'react-dom/client'
import StatisticsChartSimple from '../components/dashboard/StatisticsChartSimple'
import StatisticsChartD3 from '../components/dashboard/StatisticsChartD3'
import '../styles/application.css'

// Mount the Simple SVG chart
document.addEventListener('DOMContentLoaded', function() {
  const simpleContainer = document.getElementById('visx-chart')
  if (simpleContainer) {
    const root = createRoot(simpleContainer)
    root.render(React.createElement(StatisticsChartSimple))
  }
})

// Mount the D3 chart
document.addEventListener('DOMContentLoaded', function() {
  const d3Container = document.getElementById('d3-chart')
  if (d3Container) {
    const root = createRoot(d3Container)
    root.render(React.createElement(StatisticsChartD3))
  }
})
