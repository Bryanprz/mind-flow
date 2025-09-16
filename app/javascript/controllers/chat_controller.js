import { Controller } from "@hotwired/stimulus"

// Handles resetting the chat form and auto-scrolling the message window.
export default class extends Controller {
  static targets = ["messages", "form"]

  connect() {
    // Create an observer to watch for new messages being added.
    this.observer = new MutationObserver(() => this.scroll())
    this.observer.observe(this.messagesTarget, { childList: true })
    this.scroll() // Scroll on initial load
  }

  disconnect() {
    this.observer.disconnect()
  }

  // Action to clear the form, triggered by turbo:submit-end
  clearForm() {
    this.formTarget.reset()
  }

  // Scrolls the messages container to the bottom
  scroll() {
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }
}
