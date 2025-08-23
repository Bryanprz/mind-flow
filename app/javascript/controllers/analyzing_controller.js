import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    assessmentType: { type: String, default: 'prakruti' } // Default to prakruti if not specified
  }

  connect() {
    setTimeout(() => {
      const url = this.assessmentTypeValue === 'prakruti' 
        ? '/assessment/results' 
        : '/self';
      window.location.href = url;
    }, 3000);
  }
}
