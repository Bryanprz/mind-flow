// No import for StreamActions, it's a global on Turbo
// import { StreamActions } from "@hotwired/turbo-rails" // Remove this line

// Access StreamActions directly from Turbo global object
Turbo.StreamActions.update_url = function() {
  const url = this.getAttribute("url")
  if (url) {
    console.log("Custom Turbo Stream action: Updating URL to:", url);
    // Ensure Turbo.history is available before calling push
    if (Turbo.history && typeof Turbo.history.push === 'function') {
      Turbo.history.push(url);
    } else {
      console.warn("Turbo.history not available, falling back to Turbo.visit:", url);
      // Fallback: force a full visit if history is not ready
      Turbo.visit(url);
    }
  }
}
