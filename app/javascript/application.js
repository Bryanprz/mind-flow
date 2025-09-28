// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "turbo_stream_actions"

// Set a cookie with the browser's time zone once, so the server can render dates in the user's zone
// This will be sent with every subsequent request and used in ApplicationController#set_time_zone
(() => {
  const hasTzCookie = document.cookie.match(/(?:^|; )time_zone=/);
  if (!hasTzCookie) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Persist for 1 year
    document.cookie = `time_zone=${encodeURIComponent(tz)}; path=/; max-age=31536000; SameSite=Lax`;
  }
})();

import "trix"
import "@rails/actiontext"
import "@rails/actioncable"
import "cally"

// Initialize ActionCable for Turbo Streams
import { createConsumer } from "@rails/actioncable"
window.App = window.App || {}

// Try with explicit URL
window.App.cable = createConsumer("/cable")
console.log("🔌 ActionCable initialized with /cable URL:", !!window.App.cable)

// Monitor connection state
if (window.App.cable) {
  const connection = window.App.cable.connection
  
  // Override the connected method to log when connection opens
  const originalConnected = connection.connected
  connection.connected = function() {
    console.log("🔌 ✅ ActionCable connection opened!")
    if (originalConnected) originalConnected.call(this)
  }
  
  // Override the rejected method to log when connection is rejected
  const originalRejected = connection.rejected
  connection.rejected = function() {
    console.log("🔌 ❌ ActionCable connection rejected!")
    if (originalRejected) originalRejected.call(this)
  }
  
  // Try to open connection
  setTimeout(() => {
    console.log("🔌 Attempting to open connection...")
    console.log("🔌 Current state:", connection.state)
    if (connection.state !== 'open') {
      connection.open()
    }
  }, 1000)
}
