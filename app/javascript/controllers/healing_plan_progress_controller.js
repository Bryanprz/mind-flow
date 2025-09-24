import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["progress", "item", "journal", "journalView"]
  static values = { healingPlanId: Number, healingPlanLogId: Number, date: String } // Added static values

  connect() {
    this.update()
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
    // Find the journal view (it should be a sibling of the textarea)
    const journalView = this.element?.querySelector('[data-healing-plan-progress-target="journalView"]')
    
    if (journalView) {
      journalView.classList.add('hidden')
    }
    
    if (this.hasJournalTarget) {
      this.journalTarget.classList.remove('hidden')
      this.journalTarget.focus()
      
      // If the textarea is empty, copy the content from the view
      if (!this.journalTarget.value && journalView) {
        const journalText = journalView.querySelector('.prose')
        if (journalText) {
          this.journalTarget.value = journalText.textContent.trim()
        }
      }
    }
  }

  async savePlan() {
    console.group('savePlan');
    try {
      // Ensure we have a valid healing plan log
      await this.ensureHealingPlanLogExists();
      
      if (!this.healingPlanLogIdValue) {
        const error = new Error('Could not create or find a daily log');
        console.error('4. Error:', error);
        throw error;
      }
      
      const healingPlanId = this.healingPlanIdValue;
      const journalEntry = this.journalTarget?.value || '';
      
      // Send the journal entry
      const result = await this.sendHealingPlanLog(healingPlanId, journalEntry, this.healingPlanLogIdValue);
      
      // Force UI update
      if (this.hasJournalTarget) {
        this.journalTarget.value = journalEntry;
        this.journalTarget.dispatchEvent(new Event('input'));
      }
      
    } catch (error) {
      console.error('9. Error in savePlan:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      // Only show alert for unexpected errors
      if (!error.message.includes('Cannot save HealingPlanLog') && 
          !error.message.includes('Missing healingPlanLogId')) {
        alert('Error saving journal entry. Please try again. ' + error.message);
      }
    } finally {
      console.groupEnd();
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
