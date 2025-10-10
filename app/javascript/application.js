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

// Create ActionCable consumer with proper configuration
const cableUrl = window.location.protocol === 'https:' ? 
  `wss://${window.location.host}/cable` : 
  `ws://${window.location.host}/cable`

window.App.cable = createConsumer(cableUrl)

// Monitor connection state and handle reconnections
if (window.App.cable) {
  const connection = window.App.cable.connection
  
  // Override the connected method to log when connection opens
  const originalConnected = connection.connected
  connection.connected = function() {
    console.log('🔌 ActionCable connected')
    if (originalConnected) originalConnected.call(this)
  }
  
  // Override the rejected method to log when connection is rejected
  const originalRejected = connection.rejected
  connection.rejected = function() {
    console.log('❌ ActionCable connection rejected')
    if (originalRejected) originalRejected.call(this)
  }
  
  // Override disconnected to handle reconnections
  const originalDisconnected = connection.disconnected
  connection.disconnected = function() {
    console.log('🔌 ActionCable disconnected')
    if (originalDisconnected) originalDisconnected.call(this)
  }
  
  // Try to open connection with retry logic
  let retryCount = 0
  const maxRetries = 5
  
  const tryConnect = () => {
    if (connection.state !== 'open' && retryCount < maxRetries) {
      retryCount++
      console.log(`🔄 Attempting ActionCable connection (${retryCount}/${maxRetries})`)
      connection.open()
      
      // Retry after delay if connection fails
      setTimeout(() => {
        if (connection.state !== 'open') {
          tryConnect()
        }
      }, 2000 * retryCount) // Exponential backoff
    }
  }
  
  // Initial connection attempt
  setTimeout(tryConnect, 1000)
}
