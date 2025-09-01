import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

export default class extends Controller {
  static values = { redirectPath: String }

  connect() {
    // Redirect to the results page after a short delay
    setTimeout(() => {
      Turbo.visit(this.redirectPathValue)
    }, 3000); // 3-second delay
  }
}
