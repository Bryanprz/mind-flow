// No import for StreamActions, it's a global on Turbo
// import { StreamActions } from "@hotwired/turbo-rails" // Remove this line

// Access StreamActions directly from Turbo global object
Turbo.StreamActions.update_url = function() {
  const url = this.getAttribute("url")
  if (url) {
    console.log("Custom Turbo Stream action: Updating URL to:", url);
    Turbo.history.push(url);
  }
}