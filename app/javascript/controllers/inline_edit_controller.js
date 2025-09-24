import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["view", "form"]

  edit() {
    if (this.hasViewTarget && this.hasFormTarget) {
      this.viewTarget.classList.add("hidden")
      this.formTarget.classList.remove("hidden")
      const input = this.formTarget.querySelector("textarea,input")
      if (input) input.focus()
    }
  }

  cancel() {
    this.formTarget.classList.add("hidden")
    this.viewTarget.classList.remove("hidden")
  }

  submit(event) {
    if (event.target.tagName === "TEXTAREA" && !event.shiftKey) {
      event.preventDefault()
      event.target.form.requestSubmit()
    }
  }
}




