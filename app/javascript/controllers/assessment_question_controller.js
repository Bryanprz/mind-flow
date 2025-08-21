import { Controller } from "@hotwired/stimulus"

// Handles the assessment question submission with a delay for visual feedback.
export default class extends Controller {
  static targets = ["nextButton"]

  select() {
    // Enable the next button when an option is selected
    if (this.hasNextButtonTarget) {
      this.nextButtonTarget.disabled = false;
    }
  }
}
