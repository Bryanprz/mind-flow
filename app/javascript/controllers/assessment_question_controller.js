import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["nextButton", "form"]

  connect() {
    // Enable the next button if an option is already selected
    const selectedOption = this.element.querySelector('input[type="radio"]:checked');
    if (selectedOption && this.hasNextButtonTarget) {
      this.nextButtonTarget.disabled = false;
    }
  }

  select() {
    // Submit the form when an option is selected
    if (this.hasFormTarget) {
      this.formTarget.requestSubmit();
    } else if (this.hasNextButtonTarget) {
      // Fallback: Just enable the next button if form submission fails
      this.nextButtonTarget.disabled = false;
    }
  }
}
