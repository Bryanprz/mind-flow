import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    assessmentType: { type: String, default: 'prakruti' },
    entryId: { type: String, default: '' }
  }

  connect() {
    console.log('Analyzing controller connected with type:', this.assessmentTypeValue);
    
    // Get the entry ID from the URL or data attribute
    const entryId = this.entryIdValue || window.location.pathname.split('/').pop();
    
    // Redirect after a short delay
    setTimeout(() => {
      try {
        let url;
        if (this.assessmentTypeValue === 'prakruti') {
          url = `/health_assessments/${entryId}/results`;
        } else if (this.assessmentTypeValue === 'vikruti') {
          url = `/health_assessments/${entryId}/results`;
        } else if (this.assessmentTypeValue === 'chronic_issues') {
          url = `/health_assessments/${entryId}/chronic_issues_results`;
        } else {
          url = '/health_assessments';
        }
        
        console.log('Redirecting to:', url);
        window.location.href = url;
      } catch (error) {
        console.error('Error during redirect:', error);
        // Fallback to a safe URL
        window.location.href = '/health_assessments';
      }
    }, 3000);
  }
}
