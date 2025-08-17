// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// Set a cookie with the browser's time zone
// This will be sent with every subsequent request
document.cookie = "time_zone=" + Intl.DateTimeFormat().resolvedOptions().timeZone + ";path=/";

import "trix"
import "@rails/actiontext"
