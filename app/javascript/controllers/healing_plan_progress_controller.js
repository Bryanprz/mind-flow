import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["progress", "item", "journal", "journalView"]
  static values = { healingPlanId: Number, healingPlanLogId: Number, date: String } // Added static values

  connect() {
    this.update()
  }

  // Modern confetti animation for journal completion
  triggerConfetti() {
    this.createModernConfetti()
  }

  showSuccessMessage() {
    // Hide any existing Rails notices
    const existingNotices = document.querySelectorAll('.alert, .notice, .flash-message')
    existingNotices.forEach(notice => notice.style.display = 'none')
    
    // Add wag keyframes if not already present
    if (!document.querySelector('#wag-animation-styles')) {
      const style = document.createElement('style')
      style.id = 'wag-animation-styles'
      style.textContent = `
        @keyframes wag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
      `
      document.head.appendChild(style)
    }
    
    // Create gamified success notification - use fixed positioning for reliability
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000]'
    notification.innerHTML = `
      <div class="bg-gradient-to-r from-success to-success/80 text-success-content px-6 py-4 rounded-lg shadow-xl border border-success/20 max-w-md animate-wag" style="animation: wag 0.6s ease-in-out;">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">🎉</div>
          <div>
            <div class="font-bold text-lg">Journal Entry Saved!</div>
            <div class="text-sm opacity-90">Your healing journey continues...</div>
          </div>
          <div class="text-2xl">✨</div>
        </div>
      </div>
    `
    
    // Append to body for guaranteed visibility
    document.body.appendChild(notification)
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.style.transition = 'all 0.5s ease-out'
      notification.style.opacity = '0'
      notification.style.transform = 'translate(-50%, -10px)'
      setTimeout(() => notification.remove(), 500)
    }, 4000)
  }

  createModernConfetti() {
    // Create multiple burst points for more dynamic effect
    const burstPoints = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 }
    ]

    burstPoints.forEach((point, index) => {
      setTimeout(() => this.createConfettiBurst(point.x, point.y), index * 400) // Slower burst timing
    })
  }

  createConfettiBurst(centerX, centerY) {
    const canvas = document.createElement('canvas')
    
    // Set high-resolution canvas for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = { width: window.innerWidth, height: window.innerHeight }
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr) // Scale context for high DPI
    ctx.imageSmoothingEnabled = false // Disable smoothing for sharp pixels
    
    const particles = []
    
    // Modern color palette with gradients
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#a8e6cf', '#ffd3a5', '#fd79a8',
      '#ff7675', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'
    ]

    // Create sophisticated particles with slower, more elegant movement
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.5
      const velocity = 4 + Math.random() * 6 // Reduced from 8-20 to 4-10
      
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 2, // Reduced spread
        vy: Math.sin(angle) * velocity + (Math.random() - 0.5) * 2, // Reduced spread
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8, // Reduced from 15 to 8
        gravity: 0.15 + Math.random() * 0.1, // Reduced gravity for slower fall
        airResistance: 0.985 + Math.random() * 0.01, // Increased air resistance
        life: 1.0,
        decay: 0.005 + Math.random() * 0.005, // Slower decay
        shape: Math.random() > 0.3 ? 'circle' : 'star',
        twinkle: Math.random() > 0.7
      })
    }

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle, index) => {
        // Update physics
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += particle.gravity
        particle.vx *= particle.airResistance
        particle.vy *= particle.airResistance
        particle.rotation += particle.rotationSpeed
        particle.life -= particle.decay

        // Draw particle with modern effects
        if (particle.life > 0) {
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation * Math.PI / 180)
          ctx.globalAlpha = particle.life
          
          // Add glow effect for twinkling particles
          if (particle.twinkle) {
            ctx.shadowColor = particle.color
            ctx.shadowBlur = 6
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
          }
          
          // Create gradient for more modern look
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size/2)
          gradient.addColorStop(0, particle.color)
          gradient.addColorStop(1, this.darkenColor(particle.color, 0.3))
          ctx.fillStyle = gradient
          
          if (particle.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, particle.size/2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Draw star shape with crisp edges
            this.drawStar(ctx, 0, 0, particle.size/2, particle.size/4, 5)
          }
          
          ctx.restore()
        }

        // Remove dead particles
        if (particle.life <= 0 || particle.y > canvas.height + 100) {
          particles.splice(index, 1)
        }
      })

      // Continue animation if particles remain
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      } else {
        canvas.remove()
      }
    }

    // Start animation
    animate()
  }

  drawStar(ctx, x, y, outerRadius, innerRadius, points) {
    ctx.beginPath()
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  darkenColor(color, factor) {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Darken by factor
    const newR = Math.floor(r * (1 - factor))
    const newG = Math.floor(g * (1 - factor))
    const newB = Math.floor(b * (1 - factor))
    
    return `rgb(${newR}, ${newG}, ${newB})`
  }

  async startSession() {
    // Create a new healing plan log for this date
    try {
      const response = await fetch(`/healing_plans/${this.healingPlanIdValue}/create_daily_log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ date: this.dateValue })
      })

      if (response.ok) {
        const data = await response.json()
        // Reload the page to show the new log
        window.location.reload()
      } else {
        console.error('Failed to create daily log')
        alert('Failed to start session. Please try again.')
      }
    } catch (error) {
      console.error('Error creating daily log:', error)
      alert('An error occurred. Please try again.')
    }
  }

  async toggle(event) { // Made async
    const checkbox = event.currentTarget
    await this.ensureHealingPlanLogExists() // Ensure log exists before sending item log

    const planItemId = checkbox.dataset.planItemId
    const isCompleted = checkbox.checked

    // Send data to Rails backend for PlanItemLog
    this.sendPlanItemLog(planItemId, isCompleted, this.healingPlanLogIdValue) // Pass healingPlanLogId

    this.update()
  }

  editJournal() {
    // Hide the journal view
    if (this.hasJournalViewTarget) {
      this.journalViewTarget.classList.add('hidden')
    }
    
    // Show the textarea
    if (this.hasJournalTarget) {
      this.journalTarget.classList.remove('hidden')
      this.journalTarget.focus()
      
      // If the textarea is empty, copy the content from the view
      if (!this.journalTarget.value && this.hasJournalViewTarget) {
        const journalText = this.journalViewTarget.querySelector('.prose')
        if (journalText) {
          this.journalTarget.value = journalText.textContent.trim()
        }
      }
    }
  }

  async savePlan() {
    try {
      // Ensure we have a valid healing plan log
      await this.ensureHealingPlanLogExists();
      
      if (!this.healingPlanLogIdValue) {
        const error = new Error('Could not create or find a daily log');
        throw error;
      }
      
      const healingPlanId = this.healingPlanIdValue;
      const journalEntry = this.journalTarget?.value || '';
      
      // Send the journal entry
      const result = await this.sendHealingPlanLog(healingPlanId, journalEntry, this.healingPlanLogIdValue);
      
      // Trigger confetti animation and success message on successful save
      if (result && result.status === 'success') {
        this.triggerConfetti();
        this.showSuccessMessage();
      }
      
      // Force UI update
      if (this.hasJournalTarget) {
        this.journalTarget.value = journalEntry;
        this.journalTarget.dispatchEvent(new Event('input'));
      }
      
    } catch (error) {
      // Only show alert for unexpected errors
      if (!error.message.includes('Cannot save HealingPlanLog') && 
          !error.message.includes('Missing healingPlanLogId')) {
        alert('Error saving journal entry. Please try again. ' + error.message);
      }
    }
  }

  update() {
    const totalItems = this.itemTargets.length
    const completedItems = this.itemTargets.filter(item => this.isCompleted(item)).length

    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
    this.progressTarget.value = percentage

    this.itemTargets.forEach(itemElement => {
      const labelText = itemElement.querySelector('.label-text')
      if (this.isCompleted(itemElement)) {
        labelText.classList.add("line-through", "text-gray-400")
      } else {
        labelText.classList.remove("line-through", "text-gray-400")
      }
    })
  }

  isCompleted(itemElement) {
    const checkbox = itemElement.querySelector('input[type="checkbox"]')
    return checkbox.checked
  }

  // New method to ensure HealingPlanLog exists
  async ensureHealingPlanLogExists() {
    if (this.healingPlanLogIdValue) {
      return // HealingPlanLog ID is already set
    }

    try {
      const response = await fetch(`/healing_plans/create_daily_log`, { // New Rails endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
        },
        body: JSON.stringify({ healing_plan_id: this.healingPlanIdValue, date: this.dateValue }) // Pass healingPlanId
      })

      if (response.ok) {
        const data = await response.json()
        this.healingPlanLogIdValue = data.healing_plan_log_id // Set the Stimulus value
      } else {
        console.error("Failed to create HealingPlanLog:", response.statusText)
        alert("Error: Could not create daily log. Please try again.")
      }
    } catch (error) {
      console.error("Error creating HealingPlanLog:", error)
      alert("Error: Network issue while creating daily log.")
    }
  }

  // Helper to send PlanItemLog data
  sendPlanItemLog(planItemId, isCompleted, healingPlanLogId) { // Added healingPlanLogId param
    if (!healingPlanLogId) {
      console.error("Cannot send PlanItemLog: healingPlanLogId is missing.")
      return
    }
    fetch(`/healing_plans/log_item_progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
      },
      body: JSON.stringify({
        plan_item_id: planItemId,
        completed: isCompleted,
        healing_plan_log_id: healingPlanLogId // Pass healingPlanLogId
      })
    })
    .then(response => {
      if (!response.ok) {
        console.error("Failed to log plan item progress:", response.statusText)
      }
    })
    .catch(error => {
      console.error("Error logging plan item progress:", error)
    })
  }

  // Helper to send HealingPlanLog data
  async sendHealingPlanLog(healingPlanId, journalEntry, healingPlanLogId) {
    if (!healingPlanLogId) {
      const error = new Error('Missing healingPlanLogId in sendHealingPlanLog');
      console.error('Error details:', error);
      throw error;
    }
    
    try {
      const csrfToken = document.querySelector("meta[name='csrf-token']")?.content;
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }
      
      const response = await fetch(`/healing_plans/save_journal_log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "Accept": "application/json"
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          healing_plan_log_id: healingPlanLogId,
          journal_entry: journalEntry || ''
        })
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to save journal entry');
        error.response = responseData;
        throw error;
      }

      // Update the journal view without refreshing
      if (journalEntry.trim()) {
        // Try to find the journal view container
        let journalView = this.element?.querySelector('[data-healing-plan-progress-target="journalView"]')
        
        // If we don't have a journal view, create it
        if (!journalView) {
          // Create the view
          journalView = document.createElement('div')
          journalView.dataset.healingPlanProgressTarget = 'journalView'
          journalView.innerHTML = `
            <p class="font-semibold mt-4">Your Journal Entry:</p>
            <div class="prose max-w-none bg-base-200 rounded-lg p-3 my-2 mt-3">${journalEntry}</div>
            <button data-action="click->healing-plan-progress#editJournal" class="btn btn-sm btn-outline mt-3">Edit</button>
          `
          // Insert after the form control div
          const formControl = this.journalTarget.closest('.form-control')
          if (formControl) {
            formControl.insertAdjacentElement('afterend', journalView)
          } else {
            this.journalTarget.insertAdjacentElement('afterend', journalView)
          }
        } else {
          // Update existing view
          const journalText = journalView.querySelector('.prose')
          if (journalText) {
            journalText.textContent = journalEntry
          }
        }
        
        // Hide the textarea and show the view
        if (this.hasJournalTarget) {
          this.journalTarget.classList.add('hidden')
          journalView.classList.remove('hidden')
        }
      }
      
      // Create a fixed position container for the alert if it doesn't exist
      let alertContainer = document.getElementById('global-alert-container')
      if (!alertContainer) {
        alertContainer = document.createElement('div')
        alertContainer.id = 'global-alert-container'
        alertContainer.style.position = 'fixed'
        alertContainer.style.top = '1rem'
        alertContainer.style.left = '50%'
        alertContainer.style.transform = 'translateX(-50%)'
        alertContainer.style.zIndex = '1000'
        alertContainer.style.width = '100%'
        alertContainer.style.maxWidth = '600px'
        alertContainer.style.pointerEvents = 'none'
        document.body.appendChild(alertContainer)
      }

      // Create the alert message
      const message = document.createElement('div')
      message.className = 'alert alert-success shadow-lg mx-4 transition-all duration-300 transform'
      message.role = 'alert'
      message.style.pointerEvents = 'auto'
      message.style.opacity = '0'
      message.style.transform = 'translateY(-20px)'
      
      message.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Journal entry saved successfully!</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="this.closest('.alert').style.opacity = '0'; setTimeout(() => this.closest('.alert').remove(), 300)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `
      
      // Add to container and animate in
      alertContainer.appendChild(message)
      
      // Trigger reflow to enable animation
      void message.offsetWidth
      
      // Animate in
      message.style.opacity = '1'
      message.style.transform = 'translateY(0)'
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        message.style.opacity = '0'
        message.style.transform = 'translateY(-20px)'
        setTimeout(() => message.remove(), 300)
      }, 3000)
      
      return responseData;
      
    } catch (error) {
      console.error("Error in sendHealingPlanLog:", error);
      // Don't show alert here, let the caller handle it
      throw error;
    }
  }
}
