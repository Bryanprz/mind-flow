import React from 'react'
import { createRoot } from 'react-dom/client'
import HabitPlanView from '../components/HabitPlanView'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('habit-plan-root')
  if (container) {
    const props = JSON.parse(container.dataset.props || '{}')
    const root = createRoot(container)
    root.render(<HabitPlanView {...props} />)
  }
})
