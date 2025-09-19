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
import "cally"
