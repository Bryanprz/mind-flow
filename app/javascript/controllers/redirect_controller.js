import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

// Handles delayed redirects with a loading state
// 
// Usage:
// <div data-controller="redirect" 
//      data-redirect-url-value="/target-path"
//      data-redirect-delay-value="3000">
//   <!-- Loading content here -->
// </div>
//
// Will redirect to the specified URL after the delay (in ms)

export default class extends Controller {
  static values = { 
    url: String,
    delay: { type: Number, default: 1000 }
  }

  connect() {
    setTimeout(() => {
      Turbo.visit(this.urlValue)
    }, this.delayValue)
  }
}
