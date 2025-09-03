import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["progress", "item", "journal"]
  static values = { healingPlanId: Number, healingPlanLogId: Number } // Added static values

  connect() {
    this.update()
  }

  // Callback for when healingPlanLogIdValue changes
  healingPlanLogIdValueChanged() {
    // This callback can be used for debugging or to enable/disable UI elements
    // once the healingPlanLogId is available.
    console.log("HealingPlanLog ID is now:", this.healingPlanLogIdValue)
  }

  async toggle(event) { // Made async
    await this.ensureHealingPlanLogExists() // Ensure log exists before sending item log

    const checkbox = event.currentTarget
    const planItemId = checkbox.dataset.planItemId
    const isCompleted = checkbox.checked

    // Send data to Rails backend for PlanItemLog
    this.sendPlanItemLog(planItemId, isCompleted, this.healingPlanLogIdValue) // Pass healingPlanLogId

    this.update()
  }

  async savePlan() { // Made async
    await this.ensureHealingPlanLogExists() // Ensure log exists before saving plan log

    const healingPlanId = this.healingPlanIdValue // Get healing_plan_id from Stimulus value
    const journalEntry = this.journalTarget.value

    // Send data to Rails backend for HealingPlanLog
    this.sendHealingPlanLog(healingPlanId, journalEntry, this.healingPlanLogIdValue) // Pass healingPlanLogId
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
        body: JSON.stringify({ healing_plan_id: this.healingPlanIdValue }) // Pass healingPlanId
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
  sendHealingPlanLog(healingPlanId, journalEntry, healingPlanLogId) { // Added healingPlanLogId param
    if (!healingPlanLogId) {
      console.error("Cannot save HealingPlanLog: healingPlanLogId is missing.")
      return
    }
    fetch(`/healing_plans/save_plan_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
      },
      body: JSON.stringify({
        healing_plan_id: healingPlanId,
        journal_entry: journalEntry,
        healing_plan_log_id: healingPlanLogId // Pass healingPlanLogId
      })
    })
    .then(response => {
      if (response.ok) {
        alert("Daily Plan saved successfully!")
      } else {
        console.error("Failed to save daily plan:", response.statusText)
        alert("Failed to save Daily Plan.")
      }
    })
    .catch(error => {
      console.error("Error saving daily plan:", error)
      alert("Error saving Daily Plan.")
    })
  }
}
