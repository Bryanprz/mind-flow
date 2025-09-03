import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["link"] // Each <a> element that represents a tab link

  connect() {
    this.setActiveLink()
  }

  // Action to handle tab clicks
  select(event) {
    // Remove 'active' class from all links
    this.linkTargets.forEach(link => {
      link.classList.remove("active")
    })

    // Add 'active' class to the clicked link
    event.currentTarget.classList.add("active")
  }

  // Set initial active link based on URL parameter
  setActiveLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const durationType = urlParams.get('duration_type') || 'daily'; // Default to 'daily'

    this.linkTargets.forEach(link => {
      const linkUrl = new URL(link.href);
      const linkDurationType = new URLSearchParams(linkUrl.search).get('duration_type') || 'daily';

      if (linkDurationType === durationType) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}
